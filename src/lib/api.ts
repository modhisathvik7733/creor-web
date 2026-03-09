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

  put<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: "DELETE" });
  }

  // ── Auth ──

  async authGithub(code: string, redirectUri?: string) {
    return this.post<{ token: string; userId: string; workspaceId: string }>(
      "/api/auth/github/callback",
      { code, ...(redirectUri && { redirect_uri: redirectUri }) }
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
      currency: string;
      symbol: string;
      plan: { id: string; name: string };
      monthlyLimit: number | null;
      monthlyUsage: number;
      hasSubscription: boolean;
    }>("/api/billing");
  }

  async getQuota() {
    return this.get<{
      balance: number;
      currency: string;
      symbol: string;
      plan: { id: string; name: string; price: number | null };
      monthly: {
        current: number;
        max: number | null;
        remaining: number | null;
        pct: number | null;
        resetsAt: string;
      };
      canSend: boolean;
      blockReason: string | null;
      warnings: string[];
      overageActive: boolean;
    }>("/api/billing/quota");
  }

  async addCredits(amount: number) {
    return this.post<{
      checkoutUrl: string;
      amount: number;
      currency: string;
      symbol: string;
    }>("/api/billing/add-credits", { amount });
  }

  async subscribe(plan: "starter" | "pro" | "team") {
    return this.post<{
      checkoutUrl: string;
      plan: string;
      price: number;
      currency: string;
    }>("/api/billing/subscribe", { plan });
  }

  async getSubscription() {
    return this.get<{
      active: boolean;
      plan?: string;
      planName?: string;
      price?: number;
      currency?: string;
      graceUntil?: string | null;
      pendingPlan?: string | null;
      pendingPlanEffectiveAt?: string | null;
    }>("/api/billing/subscription");
  }

  async changePlan(plan: "starter" | "pro" | "team") {
    return this.post<{
      success: boolean;
      direction: "upgrade" | "downgrade";
      newPlan: string;
      effectiveAt?: string | null;
    }>("/api/billing/change-plan", { plan });
  }

  async cancelPendingChange() {
    return this.post<{ success: boolean }>("/api/billing/cancel-pending-change", {});
  }

  async cancelSubscription() {
    return this.post<{
      success: boolean;
      message: string;
      endsAt: string | null;
    }>("/api/billing/cancel-subscription", {});
  }

  async resumeSubscription() {
    return this.post<{ success: boolean }>("/api/billing/resume-subscription", {});
  }

  async resetBillingTest() {
    return this.post<{ success: boolean; message: string }>("/api/billing/reset-test", {});
  }

  async getPlans() {
    return this.get<{
      plans: Array<{
        id: string;
        name: string;
        price: number;
        currency: string;
        monthlyLimit: number | null;
        features: string[];
      }>;
    }>("/api/billing/plans");
  }

  async getBillingRealtimeConfig() {
    return this.get<{
      supabaseUrl: string;
      anonKey: string;
      workspaceId: string;
      tables: string[];
    }>("/api/billing/realtime-config");
  }

  async getPayments(page = 1, limit = 20) {
    return this.get<{
      payments: Array<{
        id: string;
        type: string;
        amount: number;
        currency: string;
        status: string;
        timeCreated: string;
      }>;
      page: number;
      limit: number;
    }>(`/api/billing/payments?page=${page}&limit=${limit}`);
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

  // ── Sessions ──

  async logout() {
    return this.post<{ success: boolean }>("/api/auth/logout");
  }

  async getSessions() {
    return this.get<
      Array<{
        id: string;
        device: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        timeCreated: string;
        timeExpires: string;
      }>
    >("/api/auth/sessions");
  }

  async revokeSession(id: string) {
    return this.delete<{ success: boolean }>(`/api/auth/sessions/${id}`);
  }

  // ── Device Auth ──

  async approveDevice(userCode: string) {
    return this.post<{ success: boolean }>("/api/auth/device/approve", {
      userCode,
    });
  }

  // ── Invites ──

  async getInvites() {
    return this.get<
      Array<{
        id: string;
        email: string;
        role: string;
        invitedBy: string;
        timeCreated: string;
      }>
    >("/api/invites");
  }

  async createInvite(email: string, role: "admin" | "member") {
    return this.post<{
      id: string;
      email: string;
      role: string;
      timeCreated: string;
    }>("/api/invites", { email, role });
  }

  async deleteInvite(id: string) {
    return this.delete<{ success: boolean }>(`/api/invites/${id}`);
  }

  // ── Projects ──

  async getProjects() {
    return this.get<
      Array<{
        id: string;
        name: string;
        path: string | null;
        repoUrl: string | null;
        description: string | null;
        language: string | null;
        branch: string | null;
        status: string | null;
        sessionCount: number | null;
        timeLastActive: string | null;
        timeCreated: string;
        timeUpdated: string;
      }>
    >("/api/projects");
  }

  async createProject(data: { name: string; description?: string; language?: string }) {
    return this.post<{
      id: string;
      name: string;
      description: string | null;
      language: string | null;
      branch: string | null;
      status: string | null;
      timeCreated: string;
    }>("/api/projects", data);
  }

  async deleteProject(id: string) {
    return this.delete<{ success: boolean }>(`/api/projects/${id}`);
  }

  // ── Activity ──

  async getActivity(page = 1, limit = 50) {
    return this.get<{
      activities: Array<{
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
      }>;
      page: number;
      limit: number;
    }>(`/api/activity?page=${page}&limit=${limit}`);
  }

  // ── Provider Credentials (BYOK) ──

  async getProviderCredentials() {
    return this.get<
      Array<{
        id: string;
        provider: string;
        hasCredential: boolean;
        timeCreated: string;
      }>
    >("/api/providers/credentials");
  }

  async setProviderCredential(provider: string, apiKey: string) {
    return this.put<{ success: boolean; provider: string }>(
      `/api/providers/credentials/${provider}`,
      { apiKey }
    );
  }

  async deleteProviderCredential(provider: string) {
    return this.delete<{ success: boolean }>(
      `/api/providers/credentials/${provider}`
    );
  }

  async testProviderCredential(provider: string) {
    return this.post<{ valid: boolean; error?: string }>(
      `/api/providers/credentials/${provider}/test`
    );
  }

  // ── Marketplace ──

  async getMarketplaceCatalog(params?: { category?: string; search?: string; featured?: boolean }) {
    const qs = new URLSearchParams();
    if (params?.category) qs.set("category", params.category);
    if (params?.search) qs.set("search", params.search);
    if (params?.featured) qs.set("featured", "true");
    const query = qs.toString();
    return this.get<
      Array<{
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
      }>
    >(`/api/marketplace/catalog${query ? `?${query}` : ""}`);
  }

  async getMarketplaceInstallations() {
    return this.get<
      Array<{
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
      }>
    >("/api/marketplace/installations");
  }

  async installMarketplaceItem(
    catalogSlug: string,
    configValues?: Record<string, string>,
    mcpName?: string
  ) {
    return this.post<{ id: string; mcpName: string }>(
      "/api/marketplace/installations",
      { catalogSlug, configValues, mcpName }
    );
  }

  async updateMarketplaceInstallation(
    id: string,
    data: { enabled?: boolean; configValues?: Record<string, string> }
  ) {
    return this.patch<{ success: boolean }>(
      `/api/marketplace/installations/${id}`,
      data
    );
  }

  async uninstallMarketplaceItem(id: string) {
    return this.delete<{ success: boolean }>(
      `/api/marketplace/installations/${id}`
    );
  }

  async getMarketplaceRealtimeConfig() {
    return this.get<{
      supabaseUrl: string;
      anonKey: string;
      workspaceId: string;
      table: string;
    }>("/api/marketplace/realtime-config");
  }

  // ── Share ──

  async getShare(id: string) {
    return this.get<unknown[]>(`/api/share/${id}/data`);
  }
}

export const api = new ApiClient();
