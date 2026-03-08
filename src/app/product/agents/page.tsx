import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Cpu, Check, ArrowRight } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "AI Agents",
  description:
    "Autonomous coding agents with 19+ LLM providers. Plan, build, and iterate on code with intelligent agents that understand your codebase.",
  path: "/product/agents",
});

const FEATURES = [
  {
    title: "19+ LLM Providers",
    desc: "Connect to Anthropic, OpenAI, Google, AWS Bedrock, Azure, Mistral, and more. Switch providers without changing your workflow.",
  },
  {
    title: "Background Agents",
    desc: "Run autonomous coding agents in the background. They plan, write code, run tests, and iterate until the task is complete.",
  },
  {
    title: "Context-Aware Planning",
    desc: "Agents understand your codebase through RAG-powered indexing. They read files, search semantically, and build context before acting.",
  },
];

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-[720px] px-6 pt-32 pb-20">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
          <Cpu className="h-5 w-5 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight">AI Agents</h1>
        <p className="mt-4 text-lg text-foreground-secondary">
          Autonomous coding agents with 19+ LLM providers. Plan, build, and
          iterate on code with intelligent agents that understand your codebase.
        </p>

        <div className="mt-12 space-y-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex gap-3">
              <Check className="mt-1 h-4 w-4 flex-shrink-0 text-foreground" />
              <div>
                <p className="font-medium">{f.title}</p>
                <p className="mt-0.5 text-sm text-foreground-secondary">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/download"
          className="group mt-12 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Download Creor
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </main>
    </div>
  );
}
