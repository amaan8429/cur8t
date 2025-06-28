import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { GitHubSettingsTable, CollectionsTable, LinksTable } from "@/schema";
import { Collection, Link } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import { RequestError } from "@octokit/request-error";

function convertToMarkdown(collection: Collection, links: Link[]) {
  let markdown = `# ${collection.title}\n\n`;
  markdown += `Created: ${collection.createdAt.toISOString()}\n`;
  markdown += `Last Updated: ${collection.updatedAt.toISOString()}\n\n`;
  markdown += `## Links\n\n`;

  links.forEach((link) => {
    markdown += `- [${link.title}](${link.url})\n`;
  });

  return markdown;
}

async function getCurrentContent(
  octokit: Octokit,
  owner: string,
  path: string
): Promise<string | null> {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo: "bookmarksCollection",
      path,
    });

    if ("content" in data && typeof data.content === "string") {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }
    return null;
  } catch (error) {
    if (error instanceof RequestError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

async function ensureRepoExists(octokit: Octokit, owner: string) {
  try {
    await octokit.repos.get({
      owner,
      repo: "bookmarksCollection",
    });
  } catch (error) {
    if (error instanceof RequestError && error.status === 404) {
      await octokit.repos.createForAuthenticatedUser({
        name: "bookmarksCollection",
        description: "Collection of bookmarked links synced from my app",
        private: true,
        auto_init: true,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } else {
      throw error;
    }
  }
}

const getUserInfo = async (githubToken: string) => {
  const octokit = new Octokit({ auth: githubToken });
  const { data } = await octokit.users.getAuthenticated();
  return data.login;
};

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing UserId", showToast: true },
        { status: 400 }
      );
    }

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User not found", showToast: true },
        { status: 404 }
      );
    }

    if (id !== userId) {
      return NextResponse.json(
        { error: "User does not match request", showToast: true },
        { status: 403 }
      );
    }

    const githubSettings = await db.query.GitHubSettingsTable.findFirst({
      where: eq(GitHubSettingsTable.userId, userId),
    });

    if (!githubSettings) {
      return NextResponse.json(
        { error: "GitHub not connected", showToast: true },
        { status: 400 }
      );
    }

    const { githubAccessToken: githubToken } = githubSettings;
    const octokit = new Octokit({ auth: githubToken });
    const owner = await getUserInfo(githubToken);
    await ensureRepoExists(octokit, owner);

    // Get all collections and their links
    const collections = await db.query.CollectionsTable.findMany({
      where: eq(CollectionsTable.userId, userId),
      orderBy: [desc(CollectionsTable.updatedAt)],
    });

    if (collections.length === 0) {
      return NextResponse.json({
        message: "No collections to sync",
        showToast: true,
        status: "info",
      });
    }

    // Prepare all files content and check for changes
    const files = await Promise.all(
      collections.map(async (collection) => {
        const links = await db.query.LinksTable.findMany({
          where: eq(LinksTable.linkCollectionId, collection.id),
        });
        const content = convertToMarkdown(collection, links);
        const path = `${collection.title
          .toLowerCase()
          .replace(/\s+/g, "-")}.md`;
        const currentContent = await getCurrentContent(octokit, owner, path);

        return {
          path,
          content,
          collection: collection.title,
          hasChanged: content !== currentContent,
        };
      })
    );

    // Check if any files have changed
    const changedFiles = files.filter((file) => file.hasChanged);

    if (changedFiles.length === 0) {
      return NextResponse.json({
        message: "All collections are already in sync",
        showToast: true,
        status: "success",
      });
    }

    // Get the latest commit SHA
    const { data: ref } = await octokit.git.getRef({
      owner,
      repo: "bookmarksCollection",
      ref: "heads/main",
    });
    const latestCommitSha = ref.object.sha;

    // Get the base tree
    const { data: commit } = await octokit.git.getCommit({
      owner,
      repo: "bookmarksCollection",
      commit_sha: latestCommitSha,
    });
    const baseTreeSha = commit.tree.sha;

    // Create blobs only for changed files
    const blobs = await Promise.all(
      changedFiles.map(async (file) => {
        const { data } = await octokit.git.createBlob({
          owner,
          repo: "bookmarksCollection",
          content: file.content,
          encoding: "utf-8",
        });
        return {
          path: file.path,
          mode: "100644" as const,
          type: "blob" as const,
          sha: data.sha,
        };
      })
    );

    // Create a new tree
    const { data: newTree } = await octokit.git.createTree({
      owner,
      repo: "bookmarksCollection",
      base_tree: baseTreeSha,
      tree: blobs,
    });

    // Create a commit
    const { data: newCommit } = await octokit.git.createCommit({
      owner,
      repo: "bookmarksCollection",
      message: `Sync updated collections (${changedFiles.length} changed)`,
      tree: newTree.sha,
      parents: [latestCommitSha],
    });

    // Update the reference
    await octokit.git.updateRef({
      owner,
      repo: "bookmarksCollection",
      ref: "heads/main",
      sha: newCommit.sha,
    });

    return NextResponse.json({
      message: `Successfully synced ${changedFiles.length} updated collections`,
      showToast: true,
      status: "success",
      results: changedFiles.map((file) => ({
        collection: file.collection,
        status: "success",
      })),
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      {
        error: "Failed to sync with GitHub",
        showToast: true,
        status: "error",
      },
      { status: 500 }
    );
  }
}
