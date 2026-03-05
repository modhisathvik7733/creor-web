import Link from "next/link";
import { Download, Apple, Monitor } from "lucide-react";

const GITHUB_REPO = "modhisathvik7733/creor-app";
const RELEASE_BASE = `https://github.com/${GITHUB_REPO}/releases/latest/download`;

const PLATFORMS = [
  {
    name: "macOS (Apple Silicon)",
    desc: "For M1/M2/M3/M4 Macs",
    file: "Creor-darwin-arm64.zip",
    href: `${RELEASE_BASE}/Creor-darwin-arm64.zip`,
    icon: Apple,
  },
  {
    name: "macOS (Intel)",
    desc: "For Intel-based Macs",
    file: "Creor-darwin-x64.zip",
    href: `${RELEASE_BASE}/Creor-darwin-x64.zip`,
    icon: Apple,
  },
  {
    name: "Windows",
    desc: "Windows 10/11 (64-bit)",
    file: "Creor-win32-x64.zip",
    href: `${RELEASE_BASE}/Creor-win32-x64.zip`,
    icon: Monitor,
  },
  {
    name: "Linux",
    desc: "tar.gz (64-bit)",
    file: "Creor-linux-x64.tar.gz",
    href: `${RELEASE_BASE}/Creor-linux-x64.tar.gz`,
    icon: Download,
  },
];

export default function DownloadPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Nav */}
      <header className="flex h-14 items-center justify-between border-b border-border px-6">
        <Link href="/" className="flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <span className="text-sm font-semibold">Creor</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/pricing"
            className="text-sm text-foreground-secondary hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
          >
            Sign In
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Download Creor
        </h1>
        <p className="mt-4 text-lg text-foreground-secondary">
          The AI-native code editor. Open source, multi-provider, built for
          speed.
        </p>
      </div>

      {/* Download Cards */}
      <div className="mx-auto grid max-w-3xl gap-4 px-6 pb-20 sm:grid-cols-2">
        {PLATFORMS.map((p) => (
          <a
            key={p.name}
            href={p.href}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-colors hover:bg-muted"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <p.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.desc}</p>
            </div>
            <Download className="h-4 w-4 text-muted-foreground" />
          </a>
        ))}
      </div>

      {/* System Requirements */}
      <div className="mx-auto max-w-3xl px-6 pb-20">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold">System Requirements</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <li>macOS 12+ (Monterey or later)</li>
            <li>Windows 10/11 (64-bit)</li>
            <li>Linux: Ubuntu 20.04+, Fedora 36+, or equivalent</li>
            <li>4 GB RAM minimum, 8 GB recommended</li>
            <li>500 MB disk space</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-foreground-secondary">
        Creor is open source.{" "}
        <a
          href="https://github.com/modhisathvik7733/creor-app"
          className="underline hover:text-foreground"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>
      </footer>
    </div>
  );
}
