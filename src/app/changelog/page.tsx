import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { FileText, ArrowUpRight } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Changelog",
  description:
    "Release history and version notes for Creor — the AI-native code editor.",
  path: "/changelog",
});

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">Changelog</h1>
        <p className="mt-3 max-w-md text-foreground-secondary">
          Changelog coming soon. Check the GitHub releases page for the latest
          version history.
        </p>
        <Link
          href="https://github.com/modhisathvik7733/creor-app/releases"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          View Releases <ArrowUpRight className="h-4 w-4" />
        </Link>
      </main>
    </div>
  );
}
