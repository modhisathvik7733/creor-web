import Link from "next/link";
import {
  Cpu,
  Search,
  Shield,
  ArrowRight,
  ArrowUpRight,
  Check,
  Minus,
  Bot,
  GitBranch,
  Zap,
  Network,
  BookOpen,
  Sparkles,
  Terminal,
  Code2,
  Store,
  Lock,
  Eye,
  Layers,
  TerminalSquare,
  Download,
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

/* ─── Data ─── */

const stats = [
  { value: "19+", label: "LLM Providers" },
  { value: "32+", label: "Built-in Tools" },
  { value: "15+", label: "MCP Integrations" },
  { value: "<100ms", label: "Agent Routing" },
];

const pillars = [
  {
    icon: Cpu,
    title: "Agents That Specialize",
    description:
      "Not one AI, but many. Build agents write code. Plan agents design approaches. Explore agents search your codebase. Background agents work in isolated git branches. Auto-routing picks the right one.",
  },
  {
    icon: Search,
    title: "AI That Learns Your Codebase",
    description:
      "RAG-powered semantic search indexes every file. Graph-based skills teach domain knowledge. Dependency graphs map your architecture. It doesn\u2019t guess \u2014 it knows.",
  },
  {
    icon: Shield,
    title: "Control Without Compromise",
    description:
      "Pattern-based permissions that learn from your choices. Snapshot revert to any point in a session. Bring your own API keys. Your code never leaves without your say.",
  },
];

const featureSections = [
  {
    heading: "The right agent for every task",
    label: "Multi-Agent Orchestration",
    items: [
      { icon: Code2, text: "Build Agent \u2014 full code execution: writes, edits, runs tests, commits" },
      { icon: Eye, text: "Plan Agent \u2014 read-only sandbox: designs approach without touching code" },
      { icon: Search, text: "Explore Agent \u2014 fast codebase search: grep, glob, semantic search" },
      { icon: GitBranch, text: "Background Agents \u2014 run autonomously in isolated git worktrees" },
      { icon: Zap, text: "Auto-Routing \u2014 LLM classifies your intent and picks the best agent" },
      { icon: Bot, text: "Custom Agents \u2014 define your own with custom models, permissions, and prompts" },
    ],
  },
  {
    heading: "Teach your AI what your team knows",
    label: "Graph-Based Skills",
    items: [
      { icon: Network, text: "Interconnected markdown docs organized as a knowledge graph" },
      { icon: Sparkles, text: "Auto-activation: IDF-weighted keyword matching detects relevance" },
      { icon: BookOpen, text: "Wikilink navigation between skill nodes for deep context" },
      { icon: Layers, text: "Dynamic budget: small skills inject fully, large skills extract key sections" },
      { icon: Code2, text: "Add your team\u2019s conventions, API patterns, architecture decisions" },
      { icon: Bot, text: "Skills persist across sessions and agents" },
    ],
  },
  {
    heading: "Search by meaning, not strings",
    label: "Semantic Codebase Search",
    items: [
      { icon: Search, text: "Hybrid retrieval: vector embeddings + grep for precision and recall" },
      { icon: Zap, text: "Automatic background indexing with file watching \u2014 always up to date" },
      { icon: Network, text: "Code dependency graph: understands imports, calls, inheritance" },
      { icon: Sparkles, text: "Query classifier auto-selects the best search strategy per question" },
      { icon: Layers, text: "Reranking pipeline for relevance \u2014 works with any language" },
      { icon: Eye, text: "Indexes your entire project \u2014 no manual context management" },
    ],
  },
  {
    heading: "Extend AI with one click",
    label: "MCP Marketplace",
    items: [
      { icon: Store, text: "15+ integrations: GitHub, Slack, Notion, Supabase, Linear, Sentry" },
      { icon: Lock, text: "Encrypted secrets, per-workspace config, role-based access" },
      { icon: Zap, text: "Real-time sync: dashboard changes reflect in your IDE instantly" },
      { icon: Code2, text: "No code required \u2014 just configure and enable" },
    ],
  },
  {
    heading: "Edit in place. Execute anywhere.",
    label: "Inline Edit & Terminal",
    items: [
      { icon: Code2, text: "Inline Edit: select code \u2192 Cmd+I \u2192 streaming diffs with accept/reject/retry" },
      { icon: TerminalSquare, text: "Full PTY terminals \u2014 real interactive shell, not a sandbox" },
      { icon: Eye, text: "Session context: terminal output automatically captured for AI" },
      { icon: GitBranch, text: "Snapshot revert: roll back specific files to any prior state" },
      { icon: Sparkles, text: "Diff previews: every change shown before you approve" },
    ],
  },
];

const steps = [
  {
    step: "01",
    title: "Download & Sign In",
    description:
      "Get Creor for macOS, Windows, or Linux. Connect your own API keys from Anthropic, OpenAI, Google \u2014 or subscribe to Creor Gateway for unified billing across all models.",
    icon: Download,
  },
  {
    step: "02",
    title: "Your Project, Indexed",
    description:
      "Open any project. Creor automatically indexes your codebase with RAG. Semantic search, LSP integration, dependency graphs \u2014 the AI has full context from the start.",
    icon: Search,
  },
  {
    step: "03",
    title: "Agents Build, You Ship",
    description:
      "Describe what you want. Agents plan the approach, write the code, run the tests. Review inline diffs, approve changes, iterate \u2014 all without leaving the editor.",
    icon: Zap,
  },
];

const comparisons: { feature: string; creor: string; others: string }[] = [
  { feature: "Native editor integration", creor: "Built into VS Code core", others: "Extension / plugin" },
  { feature: "Multi-agent orchestration", creor: "Build, Plan, Explore, Background", others: "Single agent" },
  { feature: "Graph-based skill system", creor: "Persistent domain knowledge", others: "No equivalent" },
  { feature: "Semantic codebase search", creor: "RAG + dependency graphs", others: "Basic context window" },
  { feature: "Permission learning", creor: "Pattern-based, session-aware", others: "Yes / no prompts" },
  { feature: "Snapshot revert", creor: "File-level, any point", others: "Session-level undo" },
  { feature: "MCP marketplace", creor: "15+ one-click integrations", others: "Limited or none" },
  { feature: "Multi-provider (19+)", creor: "BYOK or Gateway", others: "1\u20133 providers" },
];

/* ─── Page ─── */

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <OrganizationSchema />
      <SoftwareApplicationSchema />
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative px-6 pt-32 pb-20 sm:pt-40 sm:pb-28">
        <GridBackground />
        <div className="mx-auto max-w-[1080px]">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Text */}
            <div>
              <h1 className="gradient-text text-[clamp(2.5rem,6vw,4.2rem)] font-bold leading-[1.08] tracking-[-0.04em]">
                Your codebase.
                <br />
                Your agents.
                <br />
                Your rules.
              </h1>
              <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-foreground-secondary sm:text-base">
                An AI-powered IDE where agents plan, build, and ship &mdash;
                while you stay in control. Native VS Code fork. 19+ models.
                Granular permissions. No vendor lock-in.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/download"
                  className="glow-pulse group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-[14px] font-semibold text-background transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Download for Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-6 py-2.5 text-[14px] font-medium text-foreground transition-colors hover:bg-muted"
                >
                  See Pricing
                </Link>
              </div>
            </div>

            {/* Terminal */}
            <div className="lg:pl-4">
              <TerminalDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
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

      {/* ── 3 Pillars ── */}
      <section className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-[1080px]">
          <FadeIn>
            <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
              What makes Creor different
            </h2>
            <p className="mb-14 max-w-md text-[14px] leading-relaxed text-foreground-secondary">
              Built from the ground up for developers who need AI they can trust.
            </p>
          </FadeIn>
          <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
            {pillars.map((pillar, i) => (
              <FadeIn key={pillar.title} delay={i * 100}>
                <div className="card-glow flex h-full flex-col bg-background p-7">
                  <pillar.icon className="mb-4 h-5 w-5 text-foreground" />
                  <h3 className="mb-2 text-[15px] font-semibold tracking-[-0.01em]">
                    {pillar.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Deep-Dives ── */}
      {featureSections.map((section, sIdx) => (
        <section
          key={section.label}
          className={cn(
            "px-6 py-20 sm:py-24",
            sIdx % 2 === 0 ? "bg-background" : "bg-card"
          )}
        >
          <div className="mx-auto max-w-[1080px]">
            <FadeIn>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                {section.label}
              </p>
              <h2 className="mb-10 text-2xl font-bold tracking-tight sm:text-3xl">
                {section.heading}
              </h2>
            </FadeIn>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item, iIdx) => (
                <FadeIn key={item.text} delay={iIdx * 60}>
                  <div className="card-glow flex items-start gap-3 rounded-lg border border-border bg-background p-5">
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <p className="text-[13px] leading-relaxed text-foreground-secondary">
                      {item.text}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ── How It Works ── */}
      <section className="border-y border-border px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-[1080px]">
          <FadeIn>
            <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
              How it works
            </h2>
            <p className="mb-16 max-w-md text-[14px] leading-relaxed text-foreground-secondary">
              From download to shipping code in minutes.
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

      {/* ── Comparison ── */}
      <section className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-[900px]">
          <FadeIn>
            <h2 className="mb-3 text-center text-2xl font-bold tracking-tight sm:text-3xl">
              Why Creor
            </h2>
            <p className="mb-12 text-center text-sm text-foreground-secondary">
              Side-by-side with the rest of the market.
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[540px]">
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
                  {comparisons.map((row) => (
                    <tr key={row.feature} className="bg-background">
                      <td className="px-6 py-4 text-sm">{row.feature}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 text-xs text-foreground">
                          <Check className="h-3.5 w-3.5" />
                          {row.creor}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Minus className="h-3.5 w-3.5" />
                          {row.others}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-24 sm:py-32">
        <FadeIn>
          <div className="mx-auto max-w-[1080px] text-center">
            <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Ship faster. Stay in control.
            </h2>
            <p className="mb-8 text-[14px] text-foreground-secondary">
              Download Creor for free. Upgrade when you&apos;re ready.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/download"
                className="glow-pulse group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-[14px] font-semibold text-background transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Download for Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-6 py-2.5 text-[14px] font-medium text-foreground transition-colors hover:bg-muted"
              >
                See Pricing
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border px-6 py-14">
        <div className="mx-auto max-w-[1080px]">
          <div className="grid gap-8 text-[13px] sm:grid-cols-4">
            <div>
              <p className="font-semibold">Product</p>
              <div className="mt-3 space-y-2.5 text-foreground-secondary">
                <Link href="/product/agents" className="block transition-colors hover:text-foreground">
                  Agents
                </Link>
                <Link href="/product/editor" className="block transition-colors hover:text-foreground">
                  Editor
                </Link>
                <Link href="/product/terminal" className="block transition-colors hover:text-foreground">
                  Terminal
                </Link>
                <Link href="/product/search" className="block transition-colors hover:text-foreground">
                  Code Search
                </Link>
              </div>
            </div>
            <div>
              <p className="font-semibold">Resources</p>
              <div className="mt-3 space-y-2.5 text-foreground-secondary">
                <Link href="/docs" className="block transition-colors hover:text-foreground">
                  Docs
                </Link>
                <Link href="/blog" className="block transition-colors hover:text-foreground">
                  Blog
                </Link>
                <Link href="/changelog" className="block transition-colors hover:text-foreground">
                  Changelog
                </Link>
              </div>
            </div>
            <div>
              <p className="font-semibold">Company</p>
              <div className="mt-3 space-y-2.5 text-foreground-secondary">
                <Link href="/pricing" className="block transition-colors hover:text-foreground">
                  Pricing
                </Link>
                <Link href="/enterprise" className="block transition-colors hover:text-foreground">
                  Enterprise
                </Link>
              </div>
            </div>
            <div>
              <p className="font-semibold">Connect</p>
              <div className="mt-3 space-y-2.5 text-foreground-secondary">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                >
                  Twitter <ArrowUpRight className="h-3 w-3" />
                </a>
                <Link href="/docs" className="block transition-colors hover:text-foreground">
                  Support
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 flex items-center justify-between border-t border-border pt-6 text-[12px] text-muted-foreground">
            <p>
              &copy; 2026 Creor &middot;{" "}
              <span className="italic">Latin: to be created</span>
            </p>
            <div className="flex gap-4">
              <Link href="/privacy" className="transition-colors hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="transition-colors hover:text-foreground">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
