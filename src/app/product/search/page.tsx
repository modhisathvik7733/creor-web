import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { FileSearch, Check, ArrowRight } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Code Search",
  description:
    "RAG-powered semantic search across your entire codebase. Find code by meaning, not just keywords.",
  path: "/product/search",
});

const FEATURES = [
  {
    title: "Semantic Search",
    desc: "Search by intent, not just string matching. Ask 'where is authentication handled?' and get the right files, even if they never mention the word.",
  },
  {
    title: "Hybrid Retrieval",
    desc: "Combines vector embeddings with traditional grep for the best of both worlds. Fast keyword lookups augmented by semantic understanding.",
  },
  {
    title: "Automatic Indexing",
    desc: "Your codebase is indexed in the background with file watching. Changes are picked up in real time — no manual re-indexing needed.",
  },
];

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-[720px] px-6 pt-32 pb-20">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
          <FileSearch className="h-5 w-5 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight">Code Search</h1>
        <p className="mt-4 text-lg text-foreground-secondary">
          RAG-powered semantic search across your entire codebase. Find code by
          meaning, not just keywords.
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
