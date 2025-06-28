"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Ensure component is mounted to avoid hydration issues
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <div className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "relative overflow-hidden transition-all duration-500 ease-in-out",
        "hover:scale-105 active:scale-95",
        "bg-gradient-to-br",
        isDark
          ? "from-slate-800 to-slate-900 border-slate-700 hover:from-slate-700 hover:to-slate-800"
          : "from-amber-50 to-orange-100 border-amber-200 hover:from-amber-100 hover:to-orange-200"
      )}
    >
      {/* Background animated gradient */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          isDark ? "opacity-100" : "opacity-0"
        )}
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
        }}
      />

      {/* Sun icon */}
      <Sun
        className={cn(
          "absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out",
          "text-amber-500",
          isDark
            ? "scale-0 rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100"
        )}
        style={{
          filter: isDark
            ? "none"
            : "drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))",
        }}
      />

      {/* Moon icon */}
      <Moon
        className={cn(
          "absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out",
          "text-blue-400",
          isDark
            ? "scale-100 rotate-0 opacity-100"
            : "scale-0 -rotate-90 opacity-0"
        )}
        style={{
          filter: isDark
            ? "drop-shadow(0 0 8px rgba(96, 165, 250, 0.5))"
            : "none",
        }}
      />

      {/* Floating particles effect */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          isDark ? "opacity-100" : "opacity-0"
        )}
      >
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
            style={{
              left: `${20 + i * 25}%`,
              top: `${15 + i * 20}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: "2s",
            }}
          />
        ))}
      </div>

      {/* Light rays effect */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          isDark ? "opacity-0" : "opacity-100"
        )}
      >
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-amber-300 opacity-30"
            style={{
              width: "1px",
              height: "8px",
              left: "50%",
              top: "20%",
              transformOrigin: "bottom",
              transform: `translateX(-50%) rotate(${i * 45}deg)`,
              animation: "pulse 2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <span className="sr-only">
        Switch to {isDark ? "light" : "dark"} mode
      </span>
    </Button>
  );
}
