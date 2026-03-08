import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Terminal, Check, ArrowRight } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Terminal",
  description:
    "Terminal-first workflow with full PTY support. Run commands, debug, and iterate — all with AI assistance.",
  path: "/product/terminal",
});

const FEATURES = [
  {
    title: "Full PTY Support",
    desc: "Real terminal sessions with proper PTY management. Interactive commands, shell environments, and streaming output all work natively.",
  },
  {
    title: "AI-Assisted Commands",
    desc: "Agents can run shell commands, inspect output, and iterate. Build, test, and debug workflows happen right inside the terminal.",
  },
  {
    title: "Session History",
    desc: "Terminal output is captured and available to agents as context. No more copy-pasting error logs — the AI already sees them.",
  },
];

export default function TerminalPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-[720px] px-6 pt-32 pb-20">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
          <Terminal className="h-5 w-5 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight">Terminal</h1>
        <p className="mt-4 text-lg text-foreground-secondary">
          Terminal-first workflow with full PTY support. Run commands, debug, and
          iterate — all with AI assistance.
        </p>

        <div className="mt-12 space-y-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex gap-3">
              <Check className="mt-1 h-4 w-4 flex-shrink-0 text-foreground" />
              <div>
                <p className="font-medium">{f.title}</p>
                <p className="mt-0.5 text-sm text-foreground-secondary">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/download"
          className="group mt-12 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Download Creor
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </main>
    </div>
  );
}
