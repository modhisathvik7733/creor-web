"use client";

import Link from "next/link";
import { AlertCircle, RotateCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <AlertCircle className="h-4.5 w-4.5 text-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-foreground">
                Something went wrong
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-foreground-secondary">
                {error.message || "An unexpected error occurred while loading this page."}
              </p>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3 border-t border-border pt-5">
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-[13px] font-medium text-accent-foreground transition-opacity hover:opacity-80"
            >
              <RotateCw className="h-3.5 w-3.5" />
              Retry
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-md border border-border px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
