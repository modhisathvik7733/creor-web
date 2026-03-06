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
  Users,
  Rocket,
  Download,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { FadeIn } from "@/components/fade-in";
import { GridBackground } from "@/components/grid-background";
import {
  OrganizationSchema,
  SoftwareApplicationSchema,
} from "@/components/structured-data";
import { TerminalDemo } from "@/components/terminal-demo";

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

const steps = [
  {
    step: "01",
    title: "Install & Configure",
    description:
      "Download Creor or use npx. Connect your API keys from any provider — or subscribe to Creor Gateway for one key, all models.",
    icon: Download,
  },
  {
    step: "02",
    title: "Start Coding",
    description:
      "Open your project in Creor. The AI agent has full context of your codebase with RAG-powered search and LSP integration.",
    icon: Code2,
  },
  {
    step: "03",
    title: "Ship Faster",
    description:
      "Ask the AI to write features, fix bugs, or refactor. Review changes, run tests, commit — all in the same interface.",
    icon: Zap,
  },
];

const comparisons = [
  "Multi-provider AI (19+)",
  "Open source",
  "Terminal-first workflow",
  "No vendor lock-in",
  "Native editor integration",
  "25+ built-in agent tools",
];

const testimonials = [
  {
    quote:
      "Switching between Claude, GPT-4, and Gemini in the same project is a game changer. No more context switching between tools.",
    author: "Sarah Chen",
    role: "Full-stack Developer",
  },
  {
    quote:
      "The terminal integration is unmatched. I can debug, run tests, and ask AI questions without leaving the editor.",
    author: "Marcus Johnson",
    role: "DevOps Engineer",
  },
  {
    quote:
      "Finally, an AI editor that doesn't lock me into a single provider. Open source and actually extensible.",
    author: "Priya Sharma",
    role: "Tech Lead",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <OrganizationSchema />
      <SoftwareApplicationSchema />
      <Navbar />

      {/* Hero */}
      <section className="relative px-6 pt-32 pb-20 sm:pt-40 sm:pb-28">
        <GridBackground />
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
                href="/download"
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
                href="https://github.com/modhisathvik7733/creor-app"
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
            <TerminalDemo />
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

      {/* Social Proof */}
      <section className="px-6 py-20">
        <FadeIn>
          <div className="mx-auto max-w-[1080px]">
            <div className="grid gap-10 sm:grid-cols-3">
              <div className="flex items-start gap-4">
                <Github className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
                <div>
                  <p className="text-lg font-semibold">Open Source</p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground-secondary">
                    Fully open source. Inspect the code, contribute, or fork it.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Users className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
                <div>
                  <p className="text-lg font-semibold">Growing Community</p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground-secondary">
                    Join developers building with Creor on GitHub and Discord.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Rocket className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
                <div>
                  <p className="text-lg font-semibold">Production Ready</p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground-secondary">
                    Used by developers and teams shipping real products daily.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* How It Works */}
      <section className="border-y border-border px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-[1080px]">
          <FadeIn>
            <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
              How it works
            </h2>
            <p className="mb-16 max-w-md text-[14px] leading-relaxed text-foreground-secondary">
              Three steps to AI-powered development.
            </p>
          </FadeIn>
          <div className="grid gap-12 md:grid-cols-3">
            {steps.map((item, i) => (
              <FadeIn key={item.step} delay={i * 150}>
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="font-mono text-sm text-muted-foreground">
                      {item.step}
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <item.icon className="mb-4 h-5 w-5 text-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-foreground-secondary">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-[1080px]">
          <FadeIn>
            <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Everything you need
            </h2>
            <p className="mb-14 max-w-md text-[14px] leading-relaxed text-foreground-secondary">
              Write, review, and ship code — with AI that understands your
              entire codebase.
            </p>
          </FadeIn>
          <div className="grid gap-px rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 80}>
                <div className="hover-lift bg-background p-7 transition-colors hover:bg-muted/50">
                  <feature.icon className="mb-4 h-4 w-4 text-foreground" />
                  <h3 className="mb-1.5 text-[14px] font-semibold tracking-[-0.01em]">
                    {feature.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-[900px]">
          <FadeIn>
            <h2 className="mb-3 text-center text-2xl font-bold tracking-tight sm:text-3xl">
              Why Creor?
            </h2>
            <p className="mb-12 text-center text-sm text-foreground-secondary">
              Built different from the ground up.
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Creor
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Others
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {comparisons.map((feature) => (
                    <tr key={feature} className="bg-background">
                      <td className="px-6 py-4 text-sm">{feature}</td>
                      <td className="px-6 py-4 text-center">
                        <Check className="mx-auto h-4 w-4 text-foreground" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-muted-foreground">&mdash;</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-border px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-[1080px]">
          <FadeIn>
            <h2 className="mb-16 text-center text-2xl font-bold tracking-tight sm:text-3xl">
              Developers love Creor
            </h2>
          </FadeIn>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <FadeIn key={t.author} delay={i * 120}>
                <div className="hover-lift rounded-xl border border-border bg-card p-6">
                  <p className="text-sm leading-relaxed text-foreground-secondary">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                      {t.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.author}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 sm:py-32">
        <FadeIn>
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
                href="/download"
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
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-14">
        <div className="mx-auto max-w-[1080px]">
          <div className="grid gap-8 text-[13px] sm:grid-cols-4">
            <div>
              <p className="font-semibold">Product</p>
              <div className="mt-3 space-y-2.5 text-foreground-secondary">
                <Link
                  href="/product/agents"
                  className="block transition-colors hover:text-foreground"
                >
                  Agents
                </Link>
                <Link
                  href="/product/editor"
                  className="block transition-colors hover:text-foreground"
                >
                  Editor
                </Link>
                <Link
                  href="/product/terminal"
                  className="block transition-colors hover:text-foreground"
                >
                  Terminal
                </Link>
                <Link
                  href="/product/search"
                  className="block transition-colors hover:text-foreground"
                >
                  Code Search
                </Link>
              </div>
            </div>
            <div>
              <p className="font-semibold">Resources</p>
              <div className="mt-3 space-y-2.5 text-foreground-secondary">
                <Link
                  href="/docs"
                  className="block transition-colors hover:text-foreground"
                >
                  Docs
                </Link>
                <Link
                  href="/blog"
                  className="block transition-colors hover:text-foreground"
                >
                  Blog
                </Link>
                <Link
                  href="/changelog"
                  className="block transition-colors hover:text-foreground"
                >
                  Changelog
                </Link>
              </div>
            </div>
            <div>
              <p className="font-semibold">Company</p>
              <div className="mt-3 space-y-2.5 text-foreground-secondary">
                <Link
                  href="/pricing"
                  className="block transition-colors hover:text-foreground"
                >
                  Pricing
                </Link>
                <Link
                  href="/enterprise"
                  className="block transition-colors hover:text-foreground"
                >
                  Enterprise
                </Link>
              </div>
            </div>
            <div>
              <p className="font-semibold">Connect</p>
              <div className="mt-3 space-y-2.5 text-foreground-secondary">
                <a
                  href="https://github.com/modhisathvik7733/creor-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                >
                  GitHub <ArrowUpRight className="h-3 w-3" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-colors hover:text-foreground"
                >
                  <span className="inline-flex items-center gap-1">
                    Twitter <ArrowUpRight className="h-3 w-3" />
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 flex items-center justify-between border-t border-border pt-6 text-[12px] text-muted-foreground">
            <p>
              &copy; 2026 Creor &middot;{" "}
              <span className="italic">Latin: to be created</span>
            </p>
            <div className="flex gap-4">
              <Link
                href="/privacy"
                className="transition-colors hover:text-foreground"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="transition-colors hover:text-foreground"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
