"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Save, Loader2, Check, X, Key, Trash2, FlaskConical } from "lucide-react";

const PROVIDERS = [
  { id: "anthropic", name: "Anthropic", placeholder: "sk-ant-..." },
  { id: "openai", name: "OpenAI", placeholder: "sk-..." },
  { id: "google", name: "Google AI", placeholder: "AIza..." },
] as const;

type ProviderCredential = {
  id: string;
  provider: string;
  hasCredential: boolean;
  timeCreated: string;
};

function ProviderKeysSection() {
  const [credentials, setCredentials] = useState<ProviderCredential[]>([]);
  const [loadingCreds, setLoadingCreds] = useState(true);
  const [editingProvider, setEditingProvider] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [savingProvider, setSavingProvider] = useState<string | null>(null);
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [deletingProvider, setDeletingProvider] = useState<string | null>(null);

  const loadCredentials = useCallback(async () => {
    try {
      const creds = await api.getProviderCredentials();
      setCredentials(creds);
    } catch {
      // silently fail — user may not have admin access
    } finally {
      setLoadingCreds(false);
    }
  }, []);

  useEffect(() => {
    loadCredentials();
  }, [loadCredentials]);

  const getCredential = (providerId: string) =>
    credentials.find((c) => c.provider === providerId);

  const handleSaveKey = async (providerId: string) => {
    if (!apiKeyInput.trim()) return;
    setSavingProvider(providerId);
    try {
      await api.setProviderCredential(providerId, apiKeyInput.trim());
      toast.success(`${PROVIDERS.find((p) => p.id === providerId)?.name} key saved`);
      setEditingProvider(null);
      setApiKeyInput("");
      await loadCredentials();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to save key");
    } finally {
      setSavingProvider(null);
    }
  };

  const handleTestKey = async (providerId: string) => {
    setTestingProvider(providerId);
    try {
      const result = await api.testProviderCredential(providerId);
      if (result.valid) {
        toast.success("API key is valid");
      } else {
        toast.error(result.error ?? "API key is invalid");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Failed to test key");
    } finally {
      setTestingProvider(null);
    }
  };

  const handleDeleteKey = async (providerId: string) => {
    setDeletingProvider(providerId);
    try {
      await api.deleteProviderCredential(providerId);
      toast.success("API key removed");
      await loadCredentials();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to remove key");
    } finally {
      setDeletingProvider(null);
    }
  };

  if (loadingCreds) {
    return (
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold">Provider API Keys</h2>
        </div>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="font-semibold">Provider API Keys</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Use your own API keys instead of the Creor Gateway. BYOK requests bypass
          your plan limits.
        </p>
      </div>
      <div className="divide-y divide-border">
        {PROVIDERS.map((provider) => {
          const cred = getCredential(provider.id);
          const isEditing = editingProvider === provider.id;
          const isSaving = savingProvider === provider.id;
          const isTesting = testingProvider === provider.id;
          const isDeleting = deletingProvider === provider.id;

          return (
            <div key={provider.id} className="px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    <Key className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{provider.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {cred ? (
                        <span className="flex items-center gap-1">
                          <Check className="h-3 w-3 text-green-500" />
                          Configured
                        </span>
                      ) : (
                        "Not configured"
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {cred && !isEditing && (
                    <>
                      <button
                        onClick={() => handleTestKey(provider.id)}
                        disabled={isTesting}
                        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-50"
                      >
                        {isTesting ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <FlaskConical className="h-3 w-3" />
                        )}
                        Test
                      </button>
                      <button
                        onClick={() => handleDeleteKey(provider.id)}
                        disabled={isDeleting}
                        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                        Remove
                      </button>
                    </>
                  )}
                  {!isEditing && (
                    <button
                      onClick={() => {
                        setEditingProvider(provider.id);
                        setApiKeyInput("");
                      }}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                    >
                      {cred ? "Update" : "Configure"}
                    </button>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder={provider.placeholder}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveKey(provider.id);
                      if (e.key === "Escape") {
                        setEditingProvider(null);
                        setApiKeyInput("");
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveKey(provider.id)}
                    disabled={isSaving || !apiKeyInput.trim()}
                    className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingProvider(null);
                      setApiKeyInput("");
                    }}
                    className="flex items-center rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .getWorkspace()
      .then((ws) => {
        setName(ws.name);
        setSlug(ws.slug);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await api.patch("/api/workspaces/current", { name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

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
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your workspace configuration
        </p>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* General */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold">General</h2>
          </div>
          <div className="space-y-5 p-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Workspace Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Workspace URL
              </label>
              <div className="flex items-center rounded-lg border border-border bg-background">
                <span className="border-r border-border px-3 py-2 text-sm text-muted-foreground">
                  creor.ai/
                </span>
                <input
                  type="text"
                  value={slug}
                  disabled
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-muted-foreground outline-none"
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Workspace URL cannot be changed
              </p>
            </div>
          </div>
        </div>

        {/* Provider API Keys (BYOK) */}
        <ProviderKeysSection />

        {/* Danger Zone */}
        <div className="rounded-xl border border-foreground/20 bg-card">
          <div className="border-b border-foreground/20 px-5 py-4">
            <h2 className="font-semibold">Danger Zone</h2>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Delete Workspace</p>
                <p className="text-xs text-muted-foreground">
                  Permanently delete this workspace and all its data
                </p>
              </div>
              <button className="rounded-lg border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-sm text-muted-foreground">Saved!</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
