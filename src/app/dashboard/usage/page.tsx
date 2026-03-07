"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { BarChart3, Cpu, DollarSign, Zap } from "lucide-react";

interface UsageSummary {
  period: { start: string; end: string };
  cost: number;
  tokens: { input: number; output: number };
  requests: number;
}

interface ModelUsage {
  model: string;
  cost: number;
  tokens: { input: number; output: number };
  requests: number;
}

interface DailyUsage {
  date: string;
  cost: number;
  requests: number;
}

function formatUSD(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function UsagePage() {
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [byModel, setByModel] = useState<ModelUsage[]>([]);
  const [daily, setDaily] = useState<DailyUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getUsage(), api.getUsageByModel(), api.getUsageDaily()])
      .then(([s, m, d]) => {
        setSummary(s);
        setByModel(m);
        setDaily(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  const maxDailyCost = Math.max(...daily.map((d) => d.cost), 1);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Usage</h1>
        <p className="mt-1 text-muted-foreground">
          {summary
            ? `${new Date(summary.period.start).toLocaleDateString()} — ${new Date(summary.period.end).toLocaleDateString()}`
            : "Current billing period"}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Cost</span>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">
            {summary ? formatUSD(summary.cost) : "—"}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Requests</span>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">
            {summary?.requests.toLocaleString() ?? "—"}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Input Tokens</span>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">
            {summary ? formatTokens(summary.tokens.input) : "—"}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Output Tokens</span>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">
            {summary ? formatTokens(summary.tokens.output) : "—"}
          </p>
        </div>
      </div>

      {/* Daily Usage Chart (CSS bars) */}
      {daily.length > 0 && (
        <div className="mb-8 rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Daily Cost (Last 30 Days)</h2>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-end gap-1" style={{ height: 120 }}>
            {daily.map((d) => (
              <div
                key={d.date}
                className="group relative flex-1"
                style={{ height: "100%" }}
              >
                <div
                  className="absolute bottom-0 w-full rounded-sm bg-foreground/20 transition-colors group-hover:bg-foreground/40"
                  style={{
                    height: `${Math.max((d.cost / maxDailyCost) * 100, 2)}%`,
                  }}
                />
                <div className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded bg-foreground px-2 py-0.5 text-[10px] text-background whitespace-nowrap group-hover:block">
                  {formatUSD(d.cost)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>{daily[0]?.date.slice(5)}</span>
            <span>{daily[daily.length - 1]?.date.slice(5)}</span>
          </div>
        </div>
      )}

      {/* By Model */}
      {byModel.length > 0 && (
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold">Usage by Model</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Model</th>
                  <th className="px-5 py-3 font-medium text-right">Requests</th>
                  <th className="px-5 py-3 font-medium text-right">Input</th>
                  <th className="px-5 py-3 font-medium text-right">Output</th>
                  <th className="px-5 py-3 font-medium text-right">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {byModel.map((m) => (
                  <tr key={m.model}>
                    <td className="px-5 py-3 text-sm font-medium">{m.model}</td>
                    <td className="px-5 py-3 text-right text-sm text-muted-foreground">
                      {m.requests.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right text-sm text-muted-foreground">
                      {formatTokens(m.tokens.input)}
                    </td>
                    <td className="px-5 py-3 text-right text-sm text-muted-foreground">
                      {formatTokens(m.tokens.output)}
                    </td>
                    <td className="px-5 py-3 text-right text-sm font-medium">
                      {formatUSD(m.cost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
