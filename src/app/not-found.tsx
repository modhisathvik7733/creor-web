import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 pt-16">
        <div className="w-full max-w-md text-center">
          <p className="font-mono text-[80px] font-bold leading-none tracking-tighter text-foreground">
            404
          </p>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">
            Page not found
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-foreground-secondary">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-[13px] font-medium text-accent-foreground transition-opacity hover:opacity-80"
            >
              Go Home
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-md border border-border px-5 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
