import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { BookOpen, ArrowUpRight } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Documentation",
  description:
    "Guides, API reference, and tutorials for Creor — the AI-native code editor.",
  path: "/docs",
});

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <BookOpen className="h-6 w-6 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">
          Documentation
        </h1>
        <p className="mt-3 max-w-md text-foreground-secondary">
          Documentation is coming soon. In the meantime, check out the README on
          GitHub for setup instructions and usage guides.
        </p>
        <Link
          href="https://github.com/modhisathvik7733/creor-app"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          View on GitHub <ArrowUpRight className="h-4 w-4" />
        </Link>
      </main>
    </div>
  );
}
