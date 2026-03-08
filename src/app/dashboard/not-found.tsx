import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="w-full max-w-sm text-center">
        <p className="font-mono text-[56px] font-bold leading-none tracking-tighter text-foreground">
          404
        </p>
        <h1 className="mt-3 text-lg font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-foreground-secondary">
          This dashboard page does not exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-[13px] font-medium text-accent-foreground transition-opacity hover:opacity-80"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
