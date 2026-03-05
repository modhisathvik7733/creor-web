const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("creor_token", token);
    } else {
      localStorage.removeItem("creor_token");
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("creor_token");
    }
    return this.token;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      this.setToken(null);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Unauthorized");
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(body.error ?? `Request failed: ${res.status}`);
    }

    return res.json();
  }

  get<T>(path: string) {
    return this.request<T>(path);
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T>(path: string, body: unknown) {
    return this.request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: "DELETE" });
  }

  // ── Auth ──

  async authGithub(code: string) {
    return this.post<{ token: string; userId: string; workspaceId: string }>(
      "/api/auth/github/callback",
      { code }
    );
  }

  async authGoogle(code: string, redirectUri: string) {
    return this.post<{ token: string; userId: string; workspaceId: string }>(
      "/api/auth/google/callback",
      { code, redirect_uri: redirectUri }
    );
  }

  // ── User ──

  async getMe() {
    return this.get<{
      id: string;
      email: string;
      name: string;
      role: string;
      avatarUrl: string | null;
      workspaceId: string;
    }>("/api/users/me");
  }

  // ── Workspace ──

  async getWorkspace() {
    return this.get<{
      id: string;
      name: string;
      slug: string;
    }>("/api/workspaces/current");
  }

  async getMembers() {
    return this.get<
      Array<{
        id: string;
        email: string;
        name: string;
        role: string;
        avatarUrl: string | null;
        timeCreated: string;
      }>
    >("/api/workspaces/members");
  }

  // ── Billing ──

  async getBilling() {
    return this.get<{
      balance: number;
      monthlyLimit: number | null;
      monthlyUsage: number;
      reloadEnabled: boolean;
      reloadAmount: number;
      reloadTrigger: number;
      hasSubscription: boolean;
    }>("/api/billing");
  }

  async addCredits(amount: number) {
    return this.post<{ orderId: string; amount: number; currency: string }>(
      "/api/billing/add-credits",
      { amount }
    );
  }

  async subscribe(plan: "starter" | "pro" | "team") {
    return this.post<{
      subscriptionId: string;
      shortUrl: string;
      plan: string;
      price: number;
    }>("/api/billing/subscribe", { plan });
  }

  async getSubscription() {
    return this.get<{
      active: boolean;
      plan?: string;
      price?: number;
    }>("/api/billing/subscription");
  }

  // ── API Keys ──

  async getKeys() {
    return this.get<
      Array<{
        id: string;
        name: string;
        keyPrefix: string;
        timeUsed: string | null;
        timeCreated: string;
      }>
    >("/api/keys");
  }

  async createKey(name: string) {
    return this.post<{ id: string; name: string; key: string }>(
      "/api/keys",
      { name }
    );
  }

  async deleteKey(id: string) {
    return this.delete(`/api/keys/${id}`);
  }

  // ── Usage ──

  async getUsage() {
    return this.get<{
      period: { start: string; end: string };
      cost: number;
      tokens: { input: number; output: number };
      requests: number;
    }>("/api/usage");
  }

  async getUsageByModel() {
    return this.get<
      Array<{
        model: string;
        cost: number;
        tokens: { input: number; output: number };
        requests: number;
      }>
    >("/api/usage/by-model");
  }

  async getUsageDaily() {
    return this.get<
      Array<{ date: string; cost: number; requests: number }>
    >("/api/usage/daily");
  }

  // ── Models ──

  async getModels() {
    return this.get<{
      models: Array<{
        id: string;
        name: string;
        provider: string;
        contextWindow: number;
        capabilities: string[];
      }>;
    }>("/api/models");
  }

  // ── Share ──

  async getShare(id: string) {
    return this.get<unknown[]>(`/api/share/${id}/data`);
  }
}

export const api = new ApiClient();
