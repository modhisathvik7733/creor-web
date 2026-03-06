"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Wallet,
  Users,
  Zap,
  Key,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  balance: number;
  currency: string;
  symbol: string;
  requests: number;
  members: number;
  keys: number;
  plan: string | null;
  monthlyPct: number | null;
}

function formatAmount(amount: number, currency: string, symbol: string): string {
  if (currency === "INR") {
    return `${symbol}${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getQuota().catch(() => null),
      api.getUsage().catch(() => null),
      api.getMembers().catch(() => []),
      api.getKeys().catch(() => []),
    ])
      .then(([quota, usage, members, keys]) => {
        setStats({
          balance: quota?.balance ?? 0,
          currency: quota?.currency ?? "USD",
          symbol: quota?.symbol ?? "$",
          requests: usage?.requests ?? 0,
          members: members?.length ?? 1,
          keys: keys?.length ?? 0,
          plan: quota?.plan?.name ?? null,
          monthlyPct: quota?.monthly.pct ?? null,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Balance",
      value: stats
        ? formatAmount(stats.balance, stats.currency, stats.symbol)
        : "—",
      sub: stats?.plan ? `${stats.plan} plan` : "Free plan",
      icon: Wallet,
      href: "/dashboard/billing",
    },
    {
      label: "Requests (this month)",
      value: stats?.requests.toLocaleString() ?? "—",
      sub:
        stats?.monthlyPct !== null && stats?.monthlyPct !== undefined
          ? `${stats.monthlyPct}% of limit used`
          : null,
      icon: Zap,
      href: "/dashboard/usage",
    },
    {
      label: "Team Members",
      value: stats?.members.toString() ?? "—",
      sub: null,
      icon: Users,
      href: "/dashboard/team",
    },
    {
      label: "API Keys",
      value: stats?.keys.toString() ?? "—",
      sub: null,
      icon: Key,
      href: "/dashboard/keys",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Stop writing code. Start creating it.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
            {stat.sub && (
              <p className="mt-1 text-xs text-muted-foreground">{stat.sub}</p>
            )}
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold">Quick Actions</h2>
        </div>
        <div className="space-y-2 p-4">
          {[
            {
              label: "Add Credits",
              desc: "Top up your balance with Razorpay",
              href: "/dashboard/billing",
            },
            {
              label: "Create API Key",
              desc: "Generate a key for the Creor Gateway",
              href: "/dashboard/keys",
            },
            {
              label: "View Usage",
              desc: "See requests and cost breakdown by model",
              href: "/dashboard/usage",
            },
            {
              label: "Download Creor IDE",
              desc: "Get the desktop app for your platform",
              href: "/download",
            },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex w-full items-center justify-between rounded-lg border border-border p-4 text-left transition-colors hover:bg-muted"
            >
              <div>
                <p className="text-sm font-medium">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.desc}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
