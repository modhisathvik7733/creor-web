"use client";

import { useEffect, useState } from "react";

const lines = [
  { text: "$ creor agent build", delay: 0, type: "command" as const },
  {
    text: "Agent active — 19 providers, 25 tools",
    delay: 600,
    type: "info" as const,
  },
  {
    text: "> Add JWT auth with refresh tokens",
    delay: 1400,
    type: "prompt" as const,
  },
  { text: "Writing auth module...", delay: 2200, type: "info" as const },
  {
    text: "\u2713 src/auth/jwt.service.ts",
    delay: 2900,
    type: "success" as const,
  },
  {
    text: "\u2713 src/auth/auth.controller.ts",
    delay: 3400,
    type: "success" as const,
  },
  {
    text: "\u2713 src/auth/auth.guard.ts",
    delay: 3900,
    type: "success" as const,
  },
  {
    text: "\u2713 12 tests passing",
    delay: 4400,
    type: "success" as const,
  },
];

export function TerminalDemo() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timers = lines.map((line, i) =>
      setTimeout(() => setVisibleLines(i + 1), line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="flex items-center gap-1.5 border-b border-border bg-card px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-border" />
        <span className="h-2 w-2 rounded-full bg-border" />
        <span className="h-2 w-2 rounded-full bg-border" />
        <span className="ml-3 font-mono text-[11px] text-muted-foreground">
          ~/project
        </span>
      </div>
      <div className="bg-card p-5 font-mono text-[12px] leading-[1.9]">
        {lines.slice(0, visibleLines).map((line, i) => (
          <p
            key={i}
            className={`terminal-line ${
              line.type === "command"
                ? "text-foreground"
                : line.type === "info"
                  ? "text-foreground-secondary"
                  : line.type === "prompt"
                    ? "mt-3 text-foreground"
                    : "text-foreground"
            }`}
            style={{ animationDelay: "0ms" }}
          >
            {line.type === "command" && (
              <span className="text-muted-foreground">$ </span>
            )}
            {line.type === "prompt" && (
              <span className="text-muted-foreground">&gt; </span>
            )}
            {line.type === "command"
              ? line.text.replace("$ ", "")
              : line.type === "prompt"
                ? line.text.replace("> ", "")
                : line.text}
          </p>
        ))}
        {visibleLines >= lines.length && (
          <span className="inline-block h-3.5 w-[5px] animate-pulse bg-foreground" />
        )}
      </div>
    </div>
  );
}
