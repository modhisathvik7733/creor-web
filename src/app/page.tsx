import Link from "next/link";
import {
  Cpu,
  Globe,
  Terminal,
  Zap,
  Shield,
  ArrowRight,
  Code2,
  ArrowUpRight,
  Github,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";

const features = [
  {
    icon: Cpu,
    title: "Multi-Provider AI",
    description:
      "19+ LLM providers. Anthropic, OpenAI, Google, Mistral, and more. Never locked in.",
  },
  {
    icon: Terminal,
    title: "Terminal-First",
    description:
      "Built for developers who live in the terminal. Full TUI with agent capabilities.",
  },
  {
    icon: Code2,
    title: "VS Code Fork",
    description:
      "Native AI integration built into the editor. Not a plugin. Full compatibility.",
  },
  {
    icon: Globe,
    title: "Multi-Platform",
    description:
      "Desktop, web, and CLI. Works on macOS, Windows, and Linux. Deploy anywhere.",
  },
  {
    icon: Zap,
    title: "25+ Tools",
    description:
      "File ops, code search, bash, LSP, web search, RAG — all available to the agent.",
  },
  {
    icon: Shield,
    title: "Permissions",
    description:
      "Fine-grained control over what AI can access. Ask, allow, or deny per tool.",
  },
];

const stats = [
  { value: "19+", label: "LLM Providers" },
  { value: "25+", label: "Built-in Tools" },
  { value: "3", label: "Platforms" },
  { value: "<1s", label: "Agent Latency" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="px-6 pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-[1080px]">
          <div className="max-w-2xl">
            <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.035em]">
              Stop writing code.
              <br />
              Start creating it.
            </h1>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-foreground-secondary sm:text-base">
              A VS Code fork with deep AI integration. 19+ LLM providers,
              built-in agents, terminal-first workflow. No vendor lock-in.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-[13px] font-medium text-accent-foreground transition-opacity hover:opacity-80"
              >
                Download
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-5 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
              >
                Documentation
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2.5 text-[13px] text-foreground-secondary transition-colors hover:text-foreground"
              >
                <Github className="h-4 w-4" />
                Star on GitHub
              </a>
            </div>
          </div>

          {/* Terminal */}
          <div className="mt-16 max-w-2xl">
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="flex items-center gap-1.5 border-b border-border bg-card px-4 py-2.5">
                <span className="h-2 w-2 rounded-full bg-border" />
                <span className="h-2 w-2 rounded-full bg-border" />
                <span className="h-2 w-2 rounded-full bg-border" />
                <span className="ml-3 font-mono text-[11px] text-muted-foreground">
                  ~/project
                </span>
              </div>
              <div className="bg-card p-5 font-mono text-[12px] leading-[1.9]">
                <p>
                  <span className="text-muted-foreground">$</span>{" "}
                  <span className="text-foreground">creor agent build</span>
                </p>
                <p className="text-foreground-secondary">
                  Agent active — 19 providers, 25 tools
                </p>
                <p className="mt-3">
                  <span className="text-muted-foreground">&gt;</span>{" "}
                  <span className="text-foreground">
                    Add JWT auth with refresh tokens
                  </span>
                </p>
                <p className="mt-1 text-foreground-secondary">
                  Writing auth module...
                </p>
                <p className="text-foreground">
                  &#10003; src/auth/jwt.service.ts
                </p>
                <p className="text-foreground">
                  &#10003; src/auth/auth.controller.ts
                </p>
                <p className="text-foreground">
                  &#10003; src/auth/auth.guard.ts
                </p>
                <p className="text-foreground">&#10003; 12 tests passing</p>
                <span className="inline-block h-3.5 w-[5px] animate-pulse bg-foreground" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border">
        <div className="mx-auto grid max-w-[1080px] grid-cols-2 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                "px-6 py-10 text-center",
                i < stats.length - 1 && "border-r border-border"
              )}
            >
              <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-[12px] text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-[1080px]">
          <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Everything you need
          </h2>
          <p className="mb-14 max-w-md text-[14px] leading-relaxed text-foreground-secondary">
            Write, review, and ship code — with AI that understands your entire
            codebase.
          </p>
          <div className="grid gap-px rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-background p-7 transition-colors hover:bg-muted/50"
              >
                <feature.icon className="mb-4 h-4 w-4 text-foreground" />
                <h3 className="mb-1.5 text-[14px] font-semibold tracking-[-0.01em]">
                  {feature.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-[1080px] text-center">
          <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Start building
          </h2>
          <p className="mb-8 text-[14px] text-foreground-secondary">
            One command. Get started in seconds.
          </p>
          <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 font-mono text-[13px]">
            <span className="text-muted-foreground">$</span>
            <span>npx creor@latest</span>
          </div>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-[13px] font-medium text-accent-foreground transition-opacity hover:opacity-80"
            >
              Download
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-5 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
            >
              Read the docs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-14">
        <div className="mx-auto max-w-[1080px]">
          <div className="grid gap-8 text-[13px] sm:grid-cols-4">
            <div>
              <p className="font-semibold">Product</p>
              <div className="mt-3 space-y-2.5 text-foreground-secondary">
                <Link href="/product/agents" className="block transition-colors hover:text-foreground">Agents</Link>
                <Link href="/product/editor" className="block transition-colors hover:text-foreground">Editor</Link>
                <Link href="/product/terminal" className="block transition-colors hover:text-foreground">Terminal</Link>
                <Link href="/product/search" className="block transition-colors hover:text-foreground">Code Search</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold">Resources</p>
              <div className="mt-3 space-y-2.5 text-foreground-secondary">
                <Link href="/docs" className="block transition-colors hover:text-foreground">Docs</Link>
                <Link href="/blog" className="block transition-colors hover:text-foreground">Blog</Link>
                <Link href="/changelog" className="block transition-colors hover:text-foreground">Changelog</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold">Company</p>
              <div className="mt-3 space-y-2.5 text-foreground-secondary">
                <Link href="/pricing" className="block transition-colors hover:text-foreground">Pricing</Link>
                <Link href="/enterprise" className="block transition-colors hover:text-foreground">Enterprise</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold">Connect</p>
              <div className="mt-3 space-y-2.5 text-foreground-secondary">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition-colors hover:text-foreground">GitHub <ArrowUpRight className="h-3 w-3" /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="block transition-colors hover:text-foreground">
                  <span className="inline-flex items-center gap-1">Twitter <ArrowUpRight className="h-3 w-3" /></span>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 flex items-center justify-between border-t border-border pt-6 text-[12px] text-muted-foreground">
            <p>&copy; 2026 Creor &middot; <span className="italic">Latin: to be created</span></p>
            <div className="flex gap-4">
              <Link href="/privacy" className="transition-colors hover:text-foreground">Privacy</Link>
              <Link href="/terms" className="transition-colors hover:text-foreground">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
