"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useMarketplaceRealtime } from "@/hooks/use-marketplace-realtime";
import {
  Store,
  Search,
  Download,
  Trash2,
  Check,
  Loader2,
  ShieldCheck,
  Star,
  Info,
  Plug,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";

// ── Types ──

interface CatalogItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string | null;
  logoUrl: string | null;
  author: string | null;
  sourceUrl?: string | null;
  githubUrl?: string | null;
  githubStars?: number;
  serverType: string;
  tags: string[];
  featured: boolean;
  verified: boolean;
  installCount: number;
  version?: string | null;
  source?: "featured" | "registry";
  configTemplate?: Record<string, unknown>;
  configParams: Array<{
    key: string;
    label: string;
    placeholder: string;
    required: boolean;
    secret: boolean;
    helpUrl?: string;
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
    logoUrl?: string | null;
    category: string;
    author: string | null;
  };
}

// ── Constants ──

const CATEGORIES = [
  "All",
  "AI",
  "Communication",
  "Database",
  "Developer",
  "Productivity",
] as const;

const AVATAR_COLORS = [
  "bg-blue-500/15 text-blue-400",
  "bg-purple-500/15 text-purple-400",
  "bg-emerald-500/15 text-emerald-400",
  "bg-amber-500/15 text-amber-400",
  "bg-rose-500/15 text-rose-400",
  "bg-cyan-500/15 text-cyan-400",
  "bg-indigo-500/15 text-indigo-400",
  "bg-orange-500/15 text-orange-400",
];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// ── Server Icon ──

function ServerIcon({
  logoUrl,
  name,
  slug,
}: {
  logoUrl: string | null | undefined;
  name?: string;
  slug?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (logoUrl && !failed) {
    return (
      <Image
        src={logoUrl}
        alt=""
        width={32}
        height={32}
        className="rounded-md object-contain"
        onError={() => setFailed(true)}
      />
    );
  }

  const label = name ?? slug ?? "?";
  const initial = label.charAt(0).toUpperCase();
  const colorIdx = hashCode(slug ?? label) % AVATAR_COLORS.length;

  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-semibold ${AVATAR_COLORS[colorIdx]}`}
    >
      {initial}
    </div>
  );
}

// ── Skeleton ──

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-border p-4">
      <div className="mb-2.5 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-md bg-muted" />
          <div>
            <div className="h-3.5 w-28 rounded bg-muted" />
            <div className="mt-1.5 h-2.5 w-16 rounded bg-muted" />
          </div>
        </div>
        <div className="h-6 w-16 rounded-md bg-muted" />
      </div>
      <div className="mb-3 space-y-1.5">
        <div className="h-2.5 w-full rounded bg-muted" />
        <div className="h-2.5 w-3/4 rounded bg-muted" />
      </div>
      <div className="flex gap-2">
        <div className="h-4 w-12 rounded bg-muted" />
        <div className="h-4 w-10 rounded bg-muted" />
      </div>
    </div>
  );
}

// ── Helpers ──

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function formatCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

// ── Page ──

export default function MarketplacePage() {
  const [tab, setTab] = useState<"browse" | "installed">("browse");
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [totalServers, setTotalServers] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [configuringSlug, setConfiguringSlug] = useState<string | null>(null);
  const [configValues, setConfigValues] = useState<Record<string, string>>({});
  const [installing, setInstalling] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [optimisticInstalled, setOptimisticInstalled] = useState<Set<string>>(
    new Set()
  );
  const toggleAbortRef = useRef<Map<string, AbortController>>(new Map());
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchControllerRef = useRef<AbortController | null>(null);

  // ── Data fetching ──

  const fetchCatalog = useCallback(
    (append = false, offset = 0): Promise<void> => {
      // Abort previous in-flight request
      fetchControllerRef.current?.abort();
      const controller = new AbortController();
      fetchControllerRef.current = controller;

      const params: {
        category?: string;
        search?: string;
        limit?: number;
        offset?: number;
      } = { limit: 50, offset };
      if (category !== "All") params.category = category.toLowerCase();
      if (search.trim()) params.search = search.trim();

      if (append) {
        setLoadingMore(true);
      } else {
        setSearching(true);
      }

      return api
        .getMarketplaceCatalog(params)
        .then((res) => {
          if (controller.signal.aborted) return;
          if (append) {
            setCatalog((prev) => [...prev, ...res.servers]);
          } else {
            setCatalog(res.servers);
          }
          setTotalServers(res.total);
          setHasMore(res.hasMore);
        })
        .catch((err) => {
          if (controller.signal.aborted) return;
          console.error("Failed to fetch catalog:", err);
          toast.error("Failed to load MCP catalog");
        })
        .finally(() => {
          if (controller.signal.aborted) return;
          setSearching(false);
          setLoadingMore(false);
        });
    },
    [category, search]
  );

  const fetchInstallations = useCallback((): Promise<void> => {
    return api
      .getMarketplaceInstallations()
      .then((data) => {
        setInstallations(data);
        // Clear optimistic flags that are now in real data
        setOptimisticInstalled(new Set());
      })
      .catch((err) => {
        console.error("Failed to fetch installations:", err);
        toast.error("Failed to load installations");
      });
  }, []);

  // Initial load
  useEffect(() => {
    Promise.all([
      api.getMarketplaceCatalog({ limit: 50, offset: 0 }),
      api.getMarketplaceInstallations(),
    ])
      .then(([c, i]) => {
        setCatalog(c.servers);
        setTotalServers(c.total);
        setHasMore(c.hasMore);
        setInstallations(i);
      })
      .catch((err) => {
        console.error("Initial marketplace load failed:", err);
        toast.error("Failed to load marketplace data");
      })
      .finally(() => setLoading(false));
  }, []);

  // Debounced search + instant category switch
  useEffect(() => {
    if (loading) return;

    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    const delay = search.trim() ? 300 : 0;
    searchTimerRef.current = setTimeout(() => {
      fetchCatalog();
    }, delay);

    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, search]);

  // ── Realtime sync ──

  const handleRealtimeUpdate = useCallback(() => {
    fetchCatalog();
    fetchInstallations();
  }, [fetchCatalog, fetchInstallations]);

  useMarketplaceRealtime(handleRealtimeUpdate);

  // ── Handlers ──

  const handleInstall = async (item: CatalogItem) => {
    if (item.configParams.length > 0) {
      setConfiguringSlug(item.slug);
      setConfigValues({});
      return;
    }

    setInstalling(item.slug);
    try {
      const registryData =
        item.source === "registry"
          ? {
              name: item.name,
              description: item.description,
              category: item.category,
              serverType: item.serverType,
              configTemplate: item.configTemplate ?? {},
              configParams: item.configParams,
              logoUrl: item.logoUrl,
              author: item.author,
              githubUrl: item.githubUrl,
            }
          : undefined;

      await api.installMarketplaceItem(
        item.slug,
        undefined,
        undefined,
        registryData
      );

      // Optimistically mark as installed immediately
      setOptimisticInstalled((prev) => new Set(prev).add(item.slug));
      toast.success(
        `${item.name} installed! Your IDE will sync automatically.`
      );

      // Refresh data in background
      await Promise.all([fetchCatalog(), fetchInstallations()]);
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
      const registryData =
        item.source === "registry"
          ? {
              name: item.name,
              description: item.description,
              category: item.category,
              serverType: item.serverType,
              configTemplate: item.configTemplate ?? {},
              configParams: item.configParams,
              logoUrl: item.logoUrl,
              author: item.author,
              githubUrl: item.githubUrl,
            }
          : undefined;

      await api.installMarketplaceItem(
        item.slug,
        configValues,
        undefined,
        registryData
      );

      setOptimisticInstalled((prev) => new Set(prev).add(item.slug));
      toast.success(
        `${item.name} installed! Your IDE will sync automatically.`
      );
      setConfiguringSlug(null);
      setConfigValues({});

      await Promise.all([fetchCatalog(), fetchInstallations()]);
    } catch {
      toast.error(`Failed to install ${item.name}`);
    } finally {
      setInstalling(null);
    }
  };

  const handleToggle = async (inst: Installation) => {
    const prev = toggleAbortRef.current.get(inst.id);
    if (prev) prev.abort();

    const controller = new AbortController();
    toggleAbortRef.current.set(inst.id, controller);

    const newEnabled = !inst.enabled;
    setTogglingId(inst.id);
    setInstallations((p) =>
      p.map((i) => (i.id === inst.id ? { ...i, enabled: newEnabled } : i))
    );

    try {
      await api.updateMarketplaceInstallation(inst.id, {
        enabled: newEnabled,
      });
      if (controller.signal.aborted) return;
    } catch {
      if (controller.signal.aborted) return;
      setInstallations((p) =>
        p.map((i) =>
          i.id === inst.id ? { ...i, enabled: !newEnabled } : i
        )
      );
      toast.error("Failed to update");
    } finally {
      if (toggleAbortRef.current.get(inst.id) === controller) {
        toggleAbortRef.current.delete(inst.id);
        setTogglingId(null);
      }
    }
  };

  const handleUninstall = async (inst: Installation) => {
    if (!confirm(`Uninstall ${inst.catalog.name}? This cannot be undone.`))
      return;
    try {
      await api.uninstallMarketplaceItem(inst.id);
      setInstallations((prev) => prev.filter((i) => i.id !== inst.id));
      setOptimisticInstalled((prev) => {
        const next = new Set(prev);
        next.delete(inst.catalog.slug);
        return next;
      });
      toast.success(`${inst.catalog.name} uninstalled`);
    } catch {
      toast.error("Failed to uninstall");
    }
  };

  const isInstalled = (slug: string) =>
    optimisticInstalled.has(slug) ||
    installations.some((i) => i.catalog.slug === slug);

  // ── Loading state ──

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <div className="h-6 w-32 rounded bg-muted" />
          <div className="mt-2 h-3.5 w-64 rounded bg-muted" />
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-semibold tracking-tight">
              MCP Servers
            </h1>
            {totalServers > 0 && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
                {totalServers} available
              </span>
            )}
            {installations.length > 0 && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
                {installations.length} active
              </span>
            )}
          </div>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Extend your agent with Model Context Protocol servers.
          </p>
        </div>
        <a
          href="https://modelcontextprotocol.io"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
        >
          MCP Docs
          <ArrowUpRight className="h-3 w-3" />
        </a>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-6 border-b border-border">
        <button
          onClick={() => setTab("browse")}
          className={`relative pb-2.5 text-[13px] font-medium transition-colors ${
            tab === "browse"
              ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Browse
        </button>
        <button
          onClick={() => setTab("installed")}
          className={`relative pb-2.5 text-[13px] font-medium transition-colors ${
            tab === "installed"
              ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Installed
          {installations.length > 0 && (
            <span className="ml-1.5 text-muted-foreground">
              {installations.length}
            </span>
          )}
        </button>
      </div>

      {/* Browse Tab */}
      {tab === "browse" && (
        <>
          {/* Search */}
          <div className="mb-5 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search servers..."
                className="w-full rounded-md border border-border bg-transparent py-2 pl-9 pr-3 text-[13px] outline-none transition-colors focus:border-foreground/40"
              />
              {searching && (
                <Loader2 className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Fixed categories */}
          <div className="mb-6 flex flex-wrap gap-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors ${
                  category === cat
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Catalog grid */}
          {catalog.length === 0 && !searching ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Store className="mb-3 h-6 w-6 text-muted-foreground" />
              <p className="text-[13px] text-muted-foreground">
                No servers found. Try a different search.
              </p>
            </div>
          ) : (
            <>
              <div
                className={`grid grid-cols-1 gap-3 md:grid-cols-2 ${
                  searching ? "opacity-60 transition-opacity" : ""
                }`}
              >
                {catalog.map((item) => {
                  const installed = isInstalled(item.slug);
                  const isConfiguring = configuringSlug === item.slug;
                  const isInstallingThis = installing === item.slug;

                  return (
                    <div
                      key={item.id}
                      className={`group rounded-lg border border-border p-4 transition-colors hover:bg-muted/30 ${
                        isConfiguring ? "col-span-full" : ""
                      }`}
                    >
                      {/* Card header */}
                      <div className="mb-2.5 flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <ServerIcon
                            logoUrl={item.logoUrl}
                            name={item.name}
                            slug={item.slug}
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-[13px] font-semibold">
                                {item.name}
                              </h3>
                              {item.featured && (
                                <span className="rounded bg-amber-500/10 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-500">
                                  Featured
                                </span>
                              )}
                              {item.verified && (
                                <ShieldCheck className="h-3 w-3 text-muted-foreground" />
                              )}
                            </div>
                            {item.author && (
                              <p className="text-[11px] text-muted-foreground">
                                {item.author}
                              </p>
                            )}
                          </div>
                        </div>
                        {installed ? (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                            <Check className="h-3 w-3" />
                            Installed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleInstall(item)}
                            disabled={isInstallingThis}
                            className="flex items-center gap-1.5 rounded-md bg-foreground px-2.5 py-1 text-[11px] font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
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
                      <p className="mb-3 text-[12px] leading-relaxed text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>

                      {/* Meta row */}
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span
                          className={`rounded px-1.5 py-0.5 font-medium ${
                            item.serverType === "remote"
                              ? "bg-foreground/5 text-foreground-secondary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {item.serverType === "remote" ? "Cloud" : "Local"}
                        </span>
                        <span className="capitalize rounded px-1.5 py-0.5 bg-muted">
                          {item.category}
                        </span>
                        {item.version && (
                          <span className="text-muted-foreground">
                            v{item.version}
                          </span>
                        )}
                        {(item.githubStars ?? 0) > 0 && (
                          <span className="flex items-center gap-0.5 tabular-nums">
                            <Star className="h-2.5 w-2.5" />
                            {formatCount(item.githubStars!)}
                          </span>
                        )}
                        {item.githubUrl && (
                          <a
                            href={item.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors hover:text-foreground"
                            title="View source"
                          >
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                        {item.installCount > 0 && (
                          <span className="ml-auto flex items-center gap-1 tabular-nums">
                            <Download className="h-2.5 w-2.5" />
                            {formatCount(item.installCount)}
                          </span>
                        )}
                      </div>

                      {/* Config form (inline) */}
                      {isConfiguring && !installed && (
                        <div className="mt-4 border-t border-border pt-4">
                          <p className="mb-3 text-[12px] font-medium">
                            Configuration
                          </p>
                          <div className="space-y-2.5">
                            {item.configParams.map((param) => (
                              <div key={param.key}>
                                <div className="mb-1 flex items-center gap-1.5">
                                  <label className="text-[11px] text-muted-foreground">
                                    {param.label}
                                    {param.required && (
                                      <span className="ml-0.5 text-foreground">
                                        *
                                      </span>
                                    )}
                                  </label>
                                  {param.helpUrl && (
                                    <a
                                      href={param.helpUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                      Get token
                                      <ExternalLink className="h-2.5 w-2.5" />
                                    </a>
                                  )}
                                </div>
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
                                  className="w-full rounded-md border border-border bg-transparent px-2.5 py-1.5 text-[13px] outline-none transition-colors focus:border-foreground/40"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              onClick={() => handleConfiguredInstall(item)}
                              disabled={isInstallingThis}
                              className="rounded-md bg-foreground px-3 py-1.5 text-[12px] font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
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
                              className="rounded-md px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
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

              {/* Load more */}
              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => fetchCatalog(true, catalog.length)}
                    disabled={loadingMore}
                    className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : null}
                    Load more servers
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Installed Tab */}
      {tab === "installed" && (
        <div>
          <div className="mb-5 flex items-center gap-2 text-[12px] text-muted-foreground">
            <Info className="h-3.5 w-3.5 shrink-0" />
            Changes sync to your Creor IDE automatically.
          </div>

          {installations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Plug className="mb-3 h-6 w-6 text-muted-foreground" />
              <p className="text-[13px] text-muted-foreground">
                No servers installed yet.
              </p>
              <button
                onClick={() => setTab("browse")}
                className="mt-3 text-[12px] font-medium text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                Browse servers
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border rounded-lg border border-border">
              {installations.map((inst) => {
                const isToggling = togglingId === inst.id;

                return (
                  <div
                    key={inst.id}
                    className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <ServerIcon
                        logoUrl={inst.catalog.logoUrl}
                        name={inst.catalog.name}
                        slug={inst.catalog.slug}
                      />
                      <div>
                        <p className="text-[13px] font-medium">
                          {inst.catalog.name}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span>{inst.catalog.category}</span>
                          <span className="text-border">&middot;</span>
                          <span>{timeAgo(inst.timeCreated)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[11px] font-medium ${
                          inst.enabled
                            ? "text-foreground-secondary"
                            : "text-muted-foreground"
                        }`}
                      >
                        {inst.enabled ? "On" : "Off"}
                      </span>

                      <button
                        onClick={() => handleToggle(inst)}
                        disabled={isToggling}
                        className={`relative inline-flex h-[18px] w-[30px] items-center rounded-full transition-colors ${
                          inst.enabled ? "bg-foreground" : "bg-border"
                        } ${isToggling ? "opacity-50" : ""}`}
                        title={inst.enabled ? "Disable" : "Enable"}
                      >
                        <span
                          className={`inline-block h-3 w-3 rounded-full transition-transform ${
                            inst.enabled
                              ? "translate-x-[14px] bg-background"
                              : "translate-x-[3px] bg-muted-foreground"
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => handleUninstall(inst)}
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        title="Uninstall"
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
      )}
    </div>
  );
}
