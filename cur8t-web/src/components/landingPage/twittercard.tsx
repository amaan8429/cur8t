"use client";

import { VerifiedIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ReplyProps {
  authorName: string;
  authorHandle: string;
  authorImage: string;
  content: string;
  isVerified?: boolean;
  timestamp: string;
}

interface TweetCardProps {
  authorName: string;
  authorHandle: string;
  authorImage: string;
  content: string[];
  isVerified?: boolean;
  timestamp: string;
  reply?: ReplyProps;
}

export default function TweetCard({
  authorName = "Subhadeep",
  authorHandle = "mvp_Subha",
  authorImage = "https://pbs.twimg.com/profile_images/1763223695898681344/2mvSadJl_400x400.jpg",
  content = [
    "Mvpblocks is the best ever UI component collection library 🎉",
    "1. Can be opened in v0",
    "2. Can be installed with CLI",
    "3. Deploy to your app",
  ],
  isVerified = true,
  timestamp = "Mar 3, 2025",
  reply = {
    authorName: "shadcn",
    authorHandle: "shadcn",
    authorImage:
      "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
    content: "Awesome.",
    isVerified: true,
    timestamp: "March 3",
  },
}: TweetCardProps) {
  return (
    <Link href="https://x.com/mvp_Subha" target="_blank">
      <div
        className={cn(
          "relative isolate w-full max-w-xl min-w-[400px] overflow-hidden rounded-2xl p-1.5 md:min-w-[500px]",
          "bg-card/80 border border-border",
          "backdrop-blur-xl backdrop-saturate-[180%]",
          "shadow-lg",
          "translate-z-0 will-change-transform"
        )}
      >
        <div
          className={cn(
            "relative w-full rounded-xl p-5",
            "bg-card/50 border border-border/50",
            "backdrop-blur-md backdrop-saturate-150",
            "text-foreground",
            "shadow-sm",
            "translate-z-0 will-change-transform",
            "before:pointer-events-none before:absolute before:inset-0 before:bg-muted/20 before:opacity-0 before:transition-opacity before:rounded-xl",
            "hover:before:opacity-100"
          )}
        >
          <div className="flex gap-3">
            <div className="shrink-0">
              <div className="h-10 w-10 overflow-hidden rounded-full">
                <img
                  src={authorImage}
                  alt={authorName}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="cursor-pointer font-semibold text-foreground hover:underline">
                      {authorName}
                    </span>
                    {isVerified && (
                      <VerifiedIcon className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    @{authorHandle}
                  </span>
                </div>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1200"
                    height="1227"
                    fill="none"
                    viewBox="0 0 1200 1227"
                    className="h-4 w-4"
                  >
                    <title>X</title>
                    <path
                      fill="currentColor"
                      d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-2">
            {content.map((item, index) => (
              <p key={index} className="text-base text-foreground">
                {item}
              </p>
            ))}
            <span className="mt-2 block text-sm text-muted-foreground">
              {timestamp}
            </span>
          </div>

          {reply && (
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex gap-3">
                <div className="shrink-0">
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    <img
                      src={reply.authorImage}
                      alt={reply.authorName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <span className="cursor-pointer font-semibold text-foreground hover:underline">
                      {reply.authorName}
                    </span>
                    {reply.isVerified && (
                      <VerifiedIcon className="h-4 w-4 text-primary" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      @{reply.authorHandle}
                    </span>
                    <span className="text-sm text-muted-foreground">·</span>
                    <span className="text-sm text-muted-foreground">
                      {reply.timestamp}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-foreground/80">
                    {reply.content}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
