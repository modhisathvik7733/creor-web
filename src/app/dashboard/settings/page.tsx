"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

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
