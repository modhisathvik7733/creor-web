import { Save } from "lucide-react";

export default function SettingsPage() {
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
                defaultValue="Creor"
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
                  defaultValue="workspace"
                  className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Configuration */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold">AI Configuration</h2>
          </div>
          <div className="space-y-5 p-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Default Provider
              </label>
              <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent">
                <option>Anthropic (Claude)</option>
                <option>OpenAI (GPT)</option>
                <option>Google (Gemini)</option>
                <option>Mistral</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Default Model
              </label>
              <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent">
                <option>Claude Opus 4.6</option>
                <option>Claude Sonnet 4.5</option>
                <option>Claude Haiku 4.5</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Auto-approve safe tools</p>
                <p className="text-xs text-muted-foreground">
                  Automatically allow read-only tool executions
                </p>
              </div>
              <button className="h-6 w-11 rounded-full bg-accent p-0.5 transition-colors">
                <div className="h-5 w-5 translate-x-5 rounded-full bg-white transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl border border-red-500/30 bg-card">
          <div className="border-b border-red-500/30 px-5 py-4">
            <h2 className="font-semibold text-red-500">Danger Zone</h2>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Delete Workspace</p>
                <p className="text-xs text-muted-foreground">
                  Permanently delete this workspace and all its data
                </p>
              </div>
              <button className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10">
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
