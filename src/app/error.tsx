"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <AlertCircle className="h-6 w-6 text-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight">
          Something went wrong
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-foreground-secondary">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-[13px] font-medium text-accent-foreground transition-opacity hover:opacity-80"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center rounded-md border border-border px-5 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
