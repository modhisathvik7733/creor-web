"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Key, Plus, Trash2, Copy, Check, AlertCircle } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  timeUsed: string | null;
  timeCreated: string;
}

export default function KeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const fetchKeys = () => {
    api
      .getKeys()
      .then(setKeys)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreate = async () => {
    if (!newKeyName.trim()) return;
    setCreating(true);
    try {
      const result = await api.createKey(newKeyName.trim());
      setNewlyCreatedKey(result.key);
      setNewKeyName("");
      fetchKeys();
    } catch {
      toast.error("Failed to create key");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this API key? This cannot be undone.")) return;
    try {
      await api.deleteKey(id);
      setKeys((prev) => prev.filter((k) => k.id !== id));
    } catch {
      toast.error("Failed to delete key");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
          <p className="mt-1 text-muted-foreground">
            Manage keys for the Creor Gateway
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Create Key
        </button>
      </div>

      {/* Newly created key banner */}
      {newlyCreatedKey && (
        <div className="mb-6 rounded-xl border border-border bg-card p-4">
          <p className="mb-2 text-sm font-medium">
            Your new API key (copy it now — it won&apos;t be shown again):
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-lg bg-muted px-3 py-2 font-mono text-sm">
              {newlyCreatedKey}
            </code>
            <button
              onClick={() => handleCopy(newlyCreatedKey)}
              className="rounded-lg border border-border p-2 transition-colors hover:bg-muted"
            >
              {copiedKey ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <button
            onClick={() => setNewlyCreatedKey(null)}
            className="mt-3 text-xs text-muted-foreground underline hover:text-foreground"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Create key form */}
      {showCreate && !newlyCreatedKey && (
        <div className="mb-6 rounded-xl border border-border bg-card p-4">
          <p className="mb-3 text-sm font-medium">Create a new API key</p>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Key name (e.g. 'Production')"
              className="flex-1 rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <button
              onClick={handleCreate}
              disabled={creating || !newKeyName.trim()}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create"}
            </button>
            <button
              onClick={() => {
                setShowCreate(false);
                setNewKeyName("");
              }}
              className="rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Keys list */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold">
            Active Keys{" "}
            <span className="text-muted-foreground">({keys.length})</span>
          </h2>
        </div>
        {keys.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Key className="mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No API keys yet. Create one to get started.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {keys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between px-5 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <Key className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{key.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {key.keyPrefix}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">
                    {key.timeUsed
                      ? `Last used ${new Date(key.timeUsed).toLocaleDateString()}`
                      : "Never used"}
                  </span>
                  <button
                    onClick={() => handleDelete(key.id)}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <AlertCircle className="h-3 w-3" />
        Use API keys to authenticate with the Creor Gateway at
        api.creor.ai/v1/chat/completions
      </p>
    </div>
  );
}
