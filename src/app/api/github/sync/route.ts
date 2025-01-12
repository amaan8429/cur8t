import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { GitHubSettingsTable, linkCollectionTable, linkTable } from "@/schema";
import { Collection, Link } from "@/types/types";
import { auth } from "@clerk/nextjs/server";

// Utility function to convert collection and links to markdown
function convertToMarkdown(collection: Collection, links: Link[]) {
  let markdown = `# ${collection.name}\n\n`;
  markdown += `Created: ${collection.createdAt.toISOString()}\n`;
  markdown += `Last Updated: ${collection.updatedAt.toISOString()}\n\n`;
  markdown += `## Links\n\n`;

  links.forEach((link) => {
    markdown += `- [${link.title}](${link.url})\n`;
  });

  return markdown;
}

async function ensureRepoExists(octokit: Octokit, owner: string) {
  try {
    // Try to get the repo first
    await octokit.repos.get({
      owner,
      repo: "bookmarksCollection",
    });
  } catch (error) {
    // If repo doesn't exist, create it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).status === 404) {
      await octokit.repos.createForAuthenticatedUser({
        name: "bookmarksCollection",
        description: "Collection of bookmarked links synced from my app",
        private: true,
        auto_init: true, // Creates with a README
      });

      // Wait a short moment to ensure the repo is ready
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } else {
      throw error;
    }
  }
}

const getUserInfo = async (githubToken: string) => {
  const octokit = new Octokit({ auth: githubToken });
  const { data } = await octokit.users.getAuthenticated();
  return data.login; // This is the username/owner
};

export async function POST(req: Request) {
  try {
    console.log("REQ", req);
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing UserId" }, { status: 400 });
    }

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (id !== userId) {
      return NextResponse.json(
        { error: "User does not match request" },
        { status: 403 }
      );
    }

    // Get GitHub token for user
    const githubSettings = await db.query.GitHubSettingsTable.findFirst({
      where: eq(GitHubSettingsTable.userId, userId),
    });

    if (!githubSettings) {
      return NextResponse.json(
        { error: "GitHub not connected" },
        { status: 400 }
      );
    }

    const { githubAccessToken: githubToken } = githubSettings;

    // Initialize GitHub client
    const octokit = new Octokit({ auth: githubToken });

    // Get username for the owner
    const owner = await getUserInfo(githubToken);

    // Ensure repository exists
    await ensureRepoExists(octokit, owner);

    // Get all collections for the user
    const collections = await db.query.linkCollectionTable.findMany({
      where: eq(linkCollectionTable.userId, userId),
      orderBy: [desc(linkCollectionTable.updatedAt)],
    });

    const syncResults = await Promise.all(
      collections.map(async (collection) => {
        // Get all links for this collection
        const links = await db.query.linkTable.findMany({
          where: eq(linkTable.linkCollectionId, collection.id),
        });

        const content = convertToMarkdown(collection, links);
        const fileName = `${collection.name
          .toLowerCase()
          .replace(/\s+/g, "-")}.md`;

        try {
          // Check if file exists
          let sha: string | undefined;
          try {
            const { data } = await octokit.repos.getContent({
              owner,
              repo: "bookmarksCollection",
              path: fileName,
            });

            if (!Array.isArray(data)) {
              sha = data.sha;
            }
          } catch (error) {
            // File doesn't exist yet, that's okay
          }

          // Create or update file
          await octokit.repos.createOrUpdateFileContents({
            owner,
            repo: "bookmarksCollection",
            path: fileName,
            message: `Update ${collection.name} collection`,
            content: Buffer.from(content).toString("base64"),
            sha,
          });

          return {
            collection: collection.name,
            status: "success",
          };
        } catch (error) {
          console.error(`Error syncing ${collection.name}:`, error);
          return {
            collection: collection.name,
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      })
    );

    return NextResponse.json({
      message: "Sync completed",
      results: syncResults,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync with GitHub" },
      { status: 500 }
    );
  }
}
