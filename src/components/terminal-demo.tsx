"use client";

import { useEffect, useState } from "react";

const lines = [
  { text: "$ creor", delay: 0, type: "command" as const },
  { text: "\u26a1 Indexing codebase \u2014 1,247 files", delay: 600, type: "info" as const },
  { text: "> Fix the auth timeout bug in the payments flow", delay: 1400, type: "prompt" as const },
  { text: "\ud83d\udd00 Routing \u2192 build agent", delay: 2100, type: "info" as const },
  { text: "\ud83d\udcd6 Loaded skill: payments-api", delay: 2700, type: "info" as const },
  { text: "\ud83d\udd0d Searching codebase...", delay: 3200, type: "info" as const },
  { text: "\u2713 Found: src/services/payment.ts:142", delay: 3800, type: "success" as const },
  { text: "\u270e Editing src/services/payment.ts", delay: 4300, type: "success" as const },
  { text: "\u270e Editing src/middleware/auth.ts", delay: 4700, type: "success" as const },
  { text: "\u2713 2 files changed, 8 tests passing", delay: 5200, type: "success" as const },
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
        <span className="h-2 w-2 rounded-full bg-[#333]" />
        <span className="h-2 w-2 rounded-full bg-[#333]" />
        <span className="h-2 w-2 rounded-full bg-[#333]" />
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
                ? "text-foreground font-semibold"
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
