"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Activity,
  Key,
  Settings,
  CreditCard,
  Zap,
  type LucideIcon,
} from "lucide-react";

interface ActivityItem {
  id: string;
  action: string;
  resourceType: string | null;
  resourceId: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  timeCreated: string;
  actor: {
    name: string | null;
    email: string | null;
    avatarUrl: string | null;
  };
}

const ACTION_CONFIG: Record<string, { icon: LucideIcon; label: string }> = {
  "key.created": { icon: Key, label: "API key created" },
  "key.deleted": { icon: Key, label: "API key deleted" },
  "settings.updated": { icon: Settings, label: "Workspace settings updated" },
  "billing.checkout_started": { icon: CreditCard, label: "Credits checkout started" },
  "billing.subscribe_started": { icon: Zap, label: "Subscription checkout started" },
};

function getActionConfig(action: string): { icon: LucideIcon; label: string } {
  return ACTION_CONFIG[action] ?? { icon: Activity, label: action };
}

function formatTimeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  return new Date(iso).toLocaleDateString();
}

function getDetail(item: ActivityItem): string {
  const meta = item.metadata;
  switch (item.action) {
    case "key.created":
      return meta?.name ? `Key: ${meta.name}` : "";
    case "key.deleted":
      return item.resourceId ? `Key ID: ${item.resourceId}` : "";
    case "settings.updated":
      if (meta?.name) return `Name changed to "${meta.name}"`;
      return "Workspace settings changed";
    case "billing.checkout_started":
      return meta?.amount ? `$${meta.amount} ${meta.currency ?? "USD"}` : "";
    case "billing.subscribe_started":
      return meta?.plan ? `Plan: ${String(meta.plan).charAt(0).toUpperCase() + String(meta.plan).slice(1)}` : "";
    default:
      return item.resourceType ?? "";
  }
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getActivity()
      .then((res) => setActivities(res.activities))
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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Activity</h1>
        <p className="mt-1 text-muted-foreground">
          Recent activity across your workspace
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold">Timeline</h2>
        </div>
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Activity className="mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No activity yet. Events will appear here as your team uses the workspace.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {activities.map((item) => {
              const config = getActionConfig(item.action);
              const Icon = config.icon;
              const detail = getDetail(item);
              return (
                <div key={item.id} className="flex items-start gap-4 px-5 py-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{config.label}</p>
                    {detail && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {detail}
                      </p>
                    )}
                    {item.actor.name && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        by {item.actor.name}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatTimeAgo(item.timeCreated)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
