import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Code2, Check, ArrowRight } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Editor",
  description:
    "A VS Code fork with native AI integration. No extensions needed — AI is built into the core editor experience.",
  path: "/product/editor",
});

const FEATURES = [
  {
    title: "Native AI Integration",
    desc: "AI is built into the editor core, not bolted on as an extension. Chat, inline edits, and diff previews all feel native.",
  },
  {
    title: "Full VS Code Compatibility",
    desc: "All your extensions, themes, keybindings, and settings carry over. If it works in VS Code, it works in Creor.",
  },
  {
    title: "Inline Edit with Diff Preview",
    desc: "Highlight code and describe the change. Creor shows a clean diff preview you can accept, reject, or refine.",
  },
];

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-[720px] px-6 pt-32 pb-20">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
          <Code2 className="h-5 w-5 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight">Editor</h1>
        <p className="mt-4 text-lg text-foreground-secondary">
          A VS Code fork with native AI integration. No extensions needed — AI
          is built into the core editor experience.
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
