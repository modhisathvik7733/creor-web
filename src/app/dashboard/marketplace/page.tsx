"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Store,
  Search,
  Download,
  Trash2,
  Check,
  Loader2,
  ShieldCheck,
  Github,
  MessageSquare,
  FileText,
  Database,
  CheckSquare,
  FolderOpen,
  HardDrive,
  Bug,
  Globe,
  Brain,
  Sparkles,
  ListTodo,
  Package,
  Info,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── Types ──

interface CatalogItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string | null;
  author: string | null;
  serverType: string;
  tags: string[];
  featured: boolean;
  verified: boolean;
  installCount: number;
  configParams: Array<{
    key: string;
    label: string;
    placeholder: string;
    required: boolean;
    secret: boolean;
  }>;
}

interface Installation {
  id: string;
  mcpName: string;
  enabled: boolean;
  timeCreated: string;
  catalog: {
    name: string;
    slug: string;
    icon: string | null;
    category: string;
    author: string | null;
  };
}

// ── Icon mapping ──

const ICON_MAP: Record<string, LucideIcon> = {
  Github,
  MessageSquare,
  FileText,
  Database,
  CheckSquare,
  FolderOpen,
  Search,
  HardDrive,
  Bug,
  Globe,
  Brain,
  Sparkles,
  ListTodo,
};

function getIcon(name: string | null): LucideIcon {
  return name ? ICON_MAP[name] ?? Package : Package;
}

// ── Helpers ──

const CATEGORIES = [
  "All",
  "Developer",
  "Productivity",
  "Communication",
  "Database",
  "AI",
];

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

function formatInstallCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

// ── Page ──

export default function MarketplacePage() {
  const [tab, setTab] = useState<"browse" | "installed">("browse");
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [configuringSlug, setConfiguringSlug] = useState<string | null>(null);
  const [configValues, setConfigValues] = useState<Record<string, string>>({});
  const [installing, setInstalling] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // ── Data fetching ──

  const fetchCatalog = () => {
    const params: { category?: string; search?: string } = {};
    if (category !== "All") params.category = category.toLowerCase();
    if (search.trim()) params.search = search.trim();
    api
      .getMarketplaceCatalog(params)
      .then(setCatalog)
      .catch(() => {});
  };

  const fetchInstallations = () => {
    api
      .getMarketplaceInstallations()
      .then(setInstallations)
      .catch(() => {});
  };

  useEffect(() => {
    Promise.all([
      api.getMarketplaceCatalog(),
      api.getMarketplaceInstallations(),
    ])
      .then(([c, i]) => {
        setCatalog(c);
        setInstallations(i);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) fetchCatalog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, search]);

  // ── Handlers ──

  const handleInstall = async (item: CatalogItem) => {
    if (item.configParams.length > 0) {
      setConfiguringSlug(item.slug);
      setConfigValues({});
      return;
    }

    setInstalling(item.slug);
    try {
      await api.installMarketplaceItem(item.slug);
      toast.success(
        `${item.name} installed! Your IDE will sync automatically.`
      );
      fetchCatalog();
      fetchInstallations();
    } catch {
      toast.error(`Failed to install ${item.name}`);
    } finally {
      setInstalling(null);
    }
  };

  const handleConfiguredInstall = async (item: CatalogItem) => {
    const missing = item.configParams
      .filter((p) => p.required && !configValues[p.key]?.trim())
      .map((p) => p.label);
    if (missing.length > 0) {
      toast.error(`Required: ${missing.join(", ")}`);
      return;
    }

    setInstalling(item.slug);
    try {
      await api.installMarketplaceItem(item.slug, configValues);
      toast.success(
        `${item.name} installed! Your IDE will sync automatically.`
      );
      setConfiguringSlug(null);
      setConfigValues({});
      fetchCatalog();
      fetchInstallations();
    } catch {
      toast.error(`Failed to install ${item.name}`);
    } finally {
      setInstalling(null);
    }
  };

  const handleToggle = async (inst: Installation) => {
    setTogglingId(inst.id);
    try {
      await api.updateMarketplaceInstallation(inst.id, {
        enabled: !inst.enabled,
      });
      setInstallations((prev) =>
        prev.map((i) =>
          i.id === inst.id ? { ...i, enabled: !i.enabled } : i
        )
      );
    } catch {
      toast.error("Failed to update");
    } finally {
      setTogglingId(null);
    }
  };

  const handleUninstall = async (inst: Installation) => {
    if (!confirm(`Uninstall ${inst.catalog.name}? This cannot be undone.`))
      return;
    try {
      await api.uninstallMarketplaceItem(inst.id);
      setInstallations((prev) => prev.filter((i) => i.id !== inst.id));
      toast.success(`${inst.catalog.name} uninstalled`);
    } catch {
      toast.error("Failed to uninstall");
    }
  };

  const isInstalled = (slug: string) =>
    installations.some((i) => i.catalog.slug === slug);

  // ── Loading state ──

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">MCP Marketplace</h1>
        <p className="mt-1 text-muted-foreground">
          Browse and install Model Context Protocol servers
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg border border-border bg-card p-1">
        <button
          onClick={() => setTab("browse")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "browse"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Browse
        </button>
        <button
          onClick={() => setTab("installed")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "installed"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Installed
          {installations.length > 0 && (
            <span className="ml-1.5 text-xs text-muted-foreground">
              ({installations.length})
            </span>
          )}
        </button>
      </div>

      {/* ── Browse Tab ── */}
      {tab === "browse" && (
        <>
          {/* Category pills */}
          <div className="mb-4 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  category === cat
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search MCP servers..."
              className="w-full rounded-lg border border-border bg-transparent py-2 pl-10 pr-3 text-sm outline-none focus:border-foreground"
            />
          </div>

          {/* Catalog grid */}
          {catalog.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
              <Store className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No MCP servers found. Try a different search or category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {catalog.map((item) => {
                const Icon = getIcon(item.icon);
                const installed = isInstalled(item.slug);
                const isConfiguring = configuringSlug === item.slug;
                const isInstallingThis = installing === item.slug;

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/20"
                  >
                    {/* Card header */}
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                          <Icon className="h-4 w-4 text-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-semibold">
                              {item.name}
                            </h3>
                            {item.verified && (
                              <ShieldCheck className="h-3.5 w-3.5 text-foreground" />
                            )}
                          </div>
                          {item.author && (
                            <p className="text-xs text-muted-foreground">
                              by {item.author}
                            </p>
                          )}
                        </div>
                      </div>
                      {installed ? (
                        <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                          <Check className="h-3 w-3" />
                          Installed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleInstall(item)}
                          disabled={isInstallingThis}
                          className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                        >
                          {isInstallingThis ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Download className="h-3 w-3" />
                          )}
                          Install
                        </button>
                      )}
                    </div>

                    {/* Description */}
                    <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>

                    {/* Tags + meta */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          item.serverType === "remote"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.serverType === "remote" ? "Cloud" : "Local"}
                      </span>
                      {item.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                        <Download className="h-3 w-3" />
                        {formatInstallCount(item.installCount)}
                      </span>
                    </div>

                    {/* Config form (inline) */}
                    {isConfiguring && !installed && (
                      <div className="mt-4 border-t border-border pt-4">
                        <p className="mb-3 text-xs font-medium">
                          Configuration required
                        </p>
                        <div className="space-y-2.5">
                          {item.configParams.map((param) => (
                            <div key={param.key}>
                              <label className="mb-1 block text-xs text-muted-foreground">
                                {param.label}
                                {param.required && (
                                  <span className="ml-0.5 text-foreground">
                                    *
                                  </span>
                                )}
                              </label>
                              <input
                                type={param.secret ? "password" : "text"}
                                value={configValues[param.key] ?? ""}
                                onChange={(e) =>
                                  setConfigValues((prev) => ({
                                    ...prev,
                                    [param.key]: e.target.value,
                                  }))
                                }
                                placeholder={param.placeholder}
                                className="w-full rounded-lg border border-border bg-transparent px-3 py-1.5 text-sm outline-none focus:border-foreground"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() => handleConfiguredInstall(item)}
                            disabled={isInstallingThis}
                            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                          >
                            {isInstallingThis
                              ? "Installing..."
                              : "Save & Install"}
                          </button>
                          <button
                            onClick={() => {
                              setConfiguringSlug(null);
                              setConfigValues({});
                            }}
                            className="rounded-lg border border-border px-3 py-1.5 text-xs transition-colors hover:bg-muted"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── Installed Tab ── */}
      {tab === "installed" && (
        <div className="space-y-4">
          {/* Sync info banner */}
          <div className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Changes sync to your Creor IDE automatically. Restart your IDE if
              changes don&apos;t appear immediately.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold">
                Installed MCP Servers{" "}
                <span className="text-muted-foreground">
                  ({installations.length})
                </span>
              </h2>
            </div>
            {installations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Store className="mb-3 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No MCP servers installed yet. Browse the catalog to get
                  started.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {installations.map((inst) => {
                  const Icon = getIcon(inst.catalog.icon);
                  const isToggling = togglingId === inst.id;

                  return (
                    <div
                      key={inst.id}
                      className="flex items-center justify-between px-5 py-3.5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {inst.catalog.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
                              {inst.catalog.category}
                            </span>
                            <span>
                              Installed {timeAgo(inst.timeCreated)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Toggle */}
                        <button
                          onClick={() => handleToggle(inst)}
                          disabled={isToggling}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            inst.enabled ? "bg-foreground" : "bg-muted"
                          } ${isToggling ? "opacity-50" : ""}`}
                          title={inst.enabled ? "Disable" : "Enable"}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 rounded-full transition-transform ${
                              inst.enabled
                                ? "translate-x-4 bg-background"
                                : "translate-x-1 bg-muted-foreground"
                            }`}
                          />
                        </button>
                        {/* Uninstall */}
                        <button
                          onClick={() => handleUninstall(inst)}
                          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
