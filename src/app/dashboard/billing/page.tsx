"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import {
  CreditCard,
  Plus,
  Zap,
  AlertCircle,
  CheckCircle2,
  Wallet,
  Clock,
  Receipt,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  X,
  Info,
  AlertTriangle,
  XCircle,
} from "lucide-react";

// ── Toast System ──

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

let toastCounter = 0;

function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = `toast-${++toastCounter}`;
      setToasts((prev) => [...prev, { ...toast, id }]);
      const timer = setTimeout(() => dismiss(id), 5000);
      timersRef.current.set(id, timer);
      return id;
    },
    [dismiss],
  );

  // Cleanup on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return { toasts, push, dismiss };
}

const TOAST_ICONS: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const TOAST_ACCENT: Record<ToastVariant, string> = {
  success: "text-emerald-400",
  error: "text-red-400",
  warning: "text-amber-400",
  info: "text-blue-400",
};

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col-reverse gap-2.5" style={{ maxWidth: 380 }}>
      {toasts.map((toast) => {
        const Icon = TOAST_ICONS[toast.variant];
        const accent = TOAST_ACCENT[toast.variant];
        return (
          <div
            key={toast.id}
            className="animate-toast-in rounded-lg border border-border/60 bg-card px-4 py-3 shadow-lg shadow-black/20"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${accent}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-snug">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {toast.description}
                  </p>
                )}
                {toast.action && (
                  <button
                    onClick={toast.action.onClick}
                    className={`mt-1.5 text-xs font-medium ${accent} hover:underline`}
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>
              <button
                onClick={() => onDismiss(toast.id)}
                className="shrink-0 rounded p-0.5 text-muted-foreground/60 transition-colors hover:text-foreground"
                aria-label="Close notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Data Types ──

interface QuotaInfo {
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
}

interface Subscription {
  active: boolean;
  plan?: string;
  planName?: string;
  price?: number;
  currency?: string;
  graceUntil?: string | null;
  pendingPlan?: string | null;
  pendingPlanEffectiveAt?: string | null;
}

interface Payment {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  timeCreated: string;
  upgrade?: { from: string; to: string };
}

const CREDIT_PRESETS = [5, 10, 25, 50];
const MIN_CREDIT = 1;

const PLAN_DEFS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: ["All models", "$0.50/month included", "Top up anytime"],
  },
  {
    id: "starter",
    name: "Starter",
    price: 5.99,
    features: ["All models", "Email support", "$6/month included", "Top up for overage"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 23.99,
    features: ["All models", "Priority models", "Priority support", "$24/month included"],
  },
  {
    id: "team",
    name: "Team",
    price: 59.99,
    features: ["All models", "Priority models", "Dedicated support", "Admin roles", "$60/month included"],
  },
];

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Main Component ──

export default function BillingPage() {
  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingCredits, setAddingCredits] = useState(false);
  const [creditAmount, setCreditAmount] = useState(5);
  const [confirmAction, setConfirmAction] = useState<{
    type: "downgrade" | "cancel";
    plan?: string;
  } | null>(null);
  const [changingPlan, setChangingPlan] = useState(false);

  const { toasts, push: pushToast, dismiss: dismissToast } = useToasts();

  // Track which warning toasts we already showed so we don't re-fire on every render
  const shownWarningsRef = useRef<Set<string>>(new Set());

  const currentPlanId = subscription?.active ? subscription.plan : "free";

  const fetchData = useCallback(async () => {
    try {
      const [q, s, p] = await Promise.all([
        api.getQuota(),
        api.getSubscription(),
        api.getPayments(),
      ]);
      setQuota(q);
      setSubscription(s);
      setPayments(p.payments);
    } catch {
      // silently fail — auth redirect handled by api client
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Check URL params for post-checkout redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success" || params.get("subscription") === "success") {
      pushToast({
        variant: "success",
        title: "Payment successful!",
        description: "Your account has been updated.",
      });
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
      // Refresh data (webhook may take a moment)
      const timer = setTimeout(() => fetchData(), 2000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show warning/info toasts when quota data loads — fire once per warning type
  useEffect(() => {
    if (!quota) return;

    // using_credits warning
    if (quota.warnings.includes("using_credits") && !shownWarningsRef.current.has("using_credits")) {
      shownWarningsRef.current.add("using_credits");
      pushToast({
        variant: "warning",
        title: "Using top-up credits",
        description: "Plan allowance exceeded — using top-up credits for overage.",
      });
    }

    // monthly_approaching warning
    if (quota.warnings.includes("monthly_approaching") && !shownWarningsRef.current.has("monthly_approaching")) {
      shownWarningsRef.current.add("monthly_approaching");
      const resetMsg = quota.monthly.resetsAt ? formatDate(quota.monthly.resetsAt) : "next month";
      const extra = quota.balance <= 0 ? " Add credits to continue after the limit." : "";
      pushToast({
        variant: "warning",
        title: `${quota.monthly.pct}% of plan allowance used`,
        description: `Resets ${resetMsg}.${extra}`,
      });
    }

    // blocked
    if (!quota.canSend && !shownWarningsRef.current.has("blocked")) {
      shownWarningsRef.current.add("blocked");
      const blockTitle =
        quota.blockReason === "free_limit_no_credits"
          ? "Free tier limit reached"
          : quota.blockReason === "limit_no_credits"
            ? "Plan limit reached"
            : "Sending blocked";
      const blockDesc =
        quota.blockReason === "free_limit_no_credits"
          ? "Subscribe to a plan or add credits to continue."
          : quota.blockReason === "limit_no_credits"
            ? "Add credits or upgrade your plan to continue."
            : `Usage resets ${quota.monthly.resetsAt ? formatDate(quota.monthly.resetsAt) : "next month"}.`;
      pushToast({
        variant: "error",
        title: blockTitle,
        description: blockDesc,
      });
    }
  }, [quota, pushToast]);

  // Grace period toast
  useEffect(() => {
    if (
      subscription?.active &&
      subscription.graceUntil &&
      !shownWarningsRef.current.has("grace")
    ) {
      shownWarningsRef.current.add("grace");
      pushToast({
        variant: "warning",
        title: "Subscription cancelled",
        description: `Access continues until ${formatDate(subscription.graceUntil)}.`,
        action: {
          label: "Resume subscription",
          onClick: handleResumeSubscription,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscription]);

  // Pending downgrade toast
  useEffect(() => {
    if (
      subscription?.pendingPlan &&
      subscription.pendingPlanEffectiveAt &&
      !shownWarningsRef.current.has("pending_downgrade")
    ) {
      shownWarningsRef.current.add("pending_downgrade");
      const planLabel = subscription.pendingPlan.charAt(0).toUpperCase() + subscription.pendingPlan.slice(1);
      pushToast({
        variant: "info",
        title: `Downgrading to ${planLabel}`,
        description: `Takes effect on ${formatDate(subscription.pendingPlanEffectiveAt)}.`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscription]);

  // ── Add Credits ──
  const handleAddCredits = async () => {
    setAddingCredits(true);
    try {
      const result = await api.addCredits(creditAmount);
      window.location.href = result.checkoutUrl;
    } catch {
      pushToast({
        variant: "error",
        title: "Checkout failed",
        description: "Failed to create checkout. Please try again.",
      });
    } finally {
      setAddingCredits(false);
    }
  };

  // ── Subscribe (new subscription) ──
  const handleSubscribe = async (planId: "starter" | "pro" | "team") => {
    try {
      const result = await api.subscribe(planId);
      window.location.href = result.checkoutUrl;
    } catch (err) {
      pushToast({
        variant: "error",
        title: "Subscription failed",
        description: err instanceof Error ? err.message : "Failed to create subscription.",
      });
    }
  };

  // ── Change Plan (upgrade/downgrade) ──
  const handleChangePlan = async (planId: "starter" | "pro" | "team") => {
    if (!subscription?.active) {
      handleSubscribe(planId);
      return;
    }

    const currentIdx = PLAN_DEFS.findIndex((p) => p.id === currentPlanId);
    const newIdx = PLAN_DEFS.findIndex((p) => p.id === planId);
    const isDowngrade = newIdx < currentIdx;

    if (isDowngrade) {
      setConfirmAction({ type: "downgrade", plan: planId });
      return;
    }

    // Upgrade — direct API call, no new checkout needed
    setChangingPlan(true);
    try {
      await api.changePlan(planId);
      pushToast({
        variant: "success",
        title: "Plan upgraded!",
        description: "Your account has been updated.",
      });
      await fetchData();
    } catch (err) {
      pushToast({
        variant: "error",
        title: "Upgrade failed",
        description: err instanceof Error ? err.message : "Failed to change plan.",
      });
    } finally {
      setChangingPlan(false);
    }
  };

  const confirmDowngrade = async () => {
    if (!confirmAction?.plan) return;
    setChangingPlan(true);
    setConfirmAction(null);
    try {
      const result = await api.changePlan(confirmAction.plan as "starter" | "pro" | "team");
      const planLabel = confirmAction.plan.charAt(0).toUpperCase() + confirmAction.plan.slice(1);
      pushToast({
        variant: "info",
        title: `Downgrade to ${planLabel} scheduled`,
        description: result.effectiveAt
          ? `Takes effect on ${formatDate(result.effectiveAt)}.`
          : "Takes effect at end of billing cycle.",
      });
      await fetchData();
    } catch (err) {
      pushToast({
        variant: "error",
        title: "Downgrade failed",
        description: err instanceof Error ? err.message : "Failed to downgrade.",
      });
    } finally {
      setChangingPlan(false);
    }
  };

  // ── Cancel Pending Plan Change ──
  const handleCancelPendingChange = async () => {
    setChangingPlan(true);
    try {
      await api.cancelPendingChange();
      pushToast({ variant: "success", title: "Pending downgrade cancelled" });
      await fetchData();
    } catch (err) {
      pushToast({
        variant: "error",
        title: "Failed to cancel",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setChangingPlan(false);
    }
  };

  // ── Cancel Subscription ──
  const handleCancelSubscription = async () => {
    setChangingPlan(true);
    setConfirmAction(null);
    try {
      await api.cancelSubscription();
      await fetchData();
    } catch (err) {
      pushToast({
        variant: "error",
        title: "Cancellation failed",
        description: err instanceof Error ? err.message : "Failed to cancel subscription.",
      });
    } finally {
      setChangingPlan(false);
    }
  };

  // ── Resume Subscription ──
  const handleResumeSubscription = async () => {
    setChangingPlan(true);
    try {
      await api.resumeSubscription();
      await fetchData();
    } catch (err) {
      pushToast({
        variant: "error",
        title: "Resume failed",
        description: err instanceof Error ? err.message : "Failed to resume subscription.",
      });
    } finally {
      setChangingPlan(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  const monthlyPct = quota?.monthly.pct;

  return (
    <div className="p-8">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your plan and credits
        </p>
      </div>

      {/* Confirmation Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl">
            <h3 className="font-semibold">
              {confirmAction.type === "cancel" ? "Cancel Subscription?" : `Downgrade to ${confirmAction.plan?.charAt(0).toUpperCase()}${confirmAction.plan?.slice(1)}?`}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {confirmAction.type === "cancel"
                ? "Your subscription will remain active until the end of your current billing cycle, then revert to the Free plan. Your credits will be preserved."
                : "Your plan will change at the end of your current billing cycle. You'll keep your current plan limits until then. Credits are preserved."}
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 rounded-lg border border-border py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                Keep Current
              </button>
              <button
                onClick={confirmAction.type === "cancel" ? handleCancelSubscription : confirmDowngrade}
                disabled={changingPlan}
                className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {changingPlan ? "Processing..." : confirmAction.type === "cancel" ? "Cancel" : "Downgrade"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Usage, Credits & Plan Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {/* Usage Card */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Monthly Usage</span>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">
            {quota ? formatCurrency(quota.monthly.current) : "—"}
          </p>
          {quota?.monthly.max !== null && quota?.monthly.max !== undefined ? (
            <>
              <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    quota?.overageActive
                      ? "bg-orange-500"
                      : (monthlyPct ?? 0) >= 90
                        ? "bg-red-500"
                        : (monthlyPct ?? 0) >= 70
                          ? "bg-amber-500"
                          : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(monthlyPct ?? 0, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatCurrency(quota!.monthly.current)} / {formatCurrency(quota!.monthly.max)}
                {quota?.overageActive && <span className="text-orange-500"> (overage)</span>}
                {quota!.monthly.resetsAt && <> · Resets {formatDate(quota!.monthly.resetsAt)}</>}
              </p>
            </>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">No limit</p>
          )}
        </div>

        {/* Credits Card */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Top-Up Credits</span>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">
            {quota ? formatCurrency(quota.balance) : "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Used for overage beyond plan allowance
          </p>
        </div>

        {/* Plan Card */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Plan</span>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold capitalize">
            {subscription?.active
              ? subscription.planName ?? subscription.plan
              : quota?.plan?.name ?? "Free"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {subscription?.active && subscription.price
              ? `$${subscription.price}/month`
              : "Free tier"}
          </p>
          {subscription?.active && !subscription.graceUntil && (
            <button
              onClick={() => setConfirmAction({ type: "cancel" })}
              className="mt-2 text-xs text-red-500/70 hover:text-red-500"
            >
              Cancel subscription
            </button>
          )}
        </div>
      </div>

      {/* Add Credits */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Add Credits</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Top up credits for overage beyond your plan allowance
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-border px-3 py-2">
            <span className="text-sm text-muted-foreground">$</span>
            <input
              type="number"
              value={creditAmount}
              onChange={(e) => setCreditAmount(Number(e.target.value))}
              min={MIN_CREDIT}
              step={1}
              className="w-24 bg-transparent text-sm outline-none"
            />
          </div>
          <div className="flex gap-2">
            {CREDIT_PRESETS.map((amount) => (
              <button
                key={amount}
                onClick={() => setCreditAmount(amount)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  creditAmount === amount
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:bg-muted"
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>
          <button
            onClick={handleAddCredits}
            disabled={addingCredits || creditAmount < MIN_CREDIT}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            {addingCredits ? "Processing..." : "Add Credits"}
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="mb-8">
        <h2 className="mb-4 font-semibold">Plans</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          {PLAN_DEFS.map((plan) => {
            const isCurrent = plan.id === currentPlanId;
            const isPending = subscription?.pendingPlan === plan.id;
            const currentIdx = PLAN_DEFS.findIndex((p) => p.id === currentPlanId);
            const planIdx = PLAN_DEFS.findIndex((p) => p.id === plan.id);
            const isUpgrade = planIdx > currentIdx;
            const isDowngrade = planIdx < currentIdx && planIdx > 0;
            const isFree = plan.id === "free";

            return (
              <div
                key={plan.id}
                className={`rounded-xl border p-5 transition-colors ${
                  isCurrent
                    ? "border-border/80 bg-card ring-1 ring-foreground/[0.08]"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{plan.name}</h3>
                  {isCurrent && (
                    <span className="rounded-full bg-foreground/[0.07] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      Current
                    </span>
                  )}
                  {isPending && (
                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-blue-500">
                      {subscription?.pendingPlanEffectiveAt
                        ? `From ${formatDate(subscription.pendingPlanEffectiveAt)}`
                        : "Pending"}
                    </span>
                  )}
                </div>
                <p className="mt-2">
                  {isFree ? (
                    <span className="text-3xl font-bold">Free</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">
                        ${plan.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground">/month</span>
                    </>
                  )}
                </p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-0.5 text-foreground">·</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {!isCurrent && !isFree && isPending && (
                  <button
                    onClick={handleCancelPendingChange}
                    disabled={changingPlan}
                    className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-500/30 py-2.5 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-500/10 disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" /> Cancel Downgrade
                  </button>
                )}
                {!isCurrent && !isFree && !isPending && (
                  <button
                    onClick={() => handleChangePlan(plan.id as "starter" | "pro" | "team")}
                    disabled={changingPlan || !!subscription?.pendingPlan}
                    className={`mt-5 flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${
                      isUpgrade
                        ? "bg-foreground text-background hover:opacity-90"
                        : "border border-border hover:bg-muted"
                    }`}
                  >
                    {!subscription?.active ? (
                      "Subscribe"
                    ) : isUpgrade ? (
                      <>
                        <ArrowUp className="h-3.5 w-3.5" /> Upgrade
                      </>
                    ) : isDowngrade ? (
                      <>
                        <ArrowDown className="h-3.5 w-3.5" /> Downgrade
                      </>
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                )}
                {isCurrent && !isFree && (
                  <div className="mt-5 flex w-full items-center justify-center rounded-lg border border-border py-2.5 text-sm font-medium text-muted-foreground">
                    Current Plan
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          <AlertCircle className="h-3 w-3" />
          Upgrades are immediate with prorated billing. Downgrades take effect at cycle end. All prices in USD.
        </p>
      </div>

      {/* Payment History */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold">Payment History</h2>
          </div>
        </div>
        {payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <Clock className="mb-2 h-6 w-6" />
            <p className="text-sm">No payments yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                      p.type === "onboarding"
                        ? "bg-blue-500/10 text-blue-500"
                        : p.type === "credits"
                          ? "bg-green-500/10 text-green-500"
                          : p.upgrade
                            ? "bg-orange-500/10 text-orange-500"
                            : p.type === "subscription"
                              ? "bg-purple-500/10 text-purple-500"
                              : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {p.type === "onboarding" ? "OB" : p.type === "credits" ? "CR" : p.upgrade ? (
                      <ArrowUp className="h-3.5 w-3.5" />
                    ) : p.type === "subscription" ? "SB" : "RF"}
                  </div>
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {p.upgrade
                        ? `Upgrade · ${p.upgrade.from} → ${p.upgrade.to}`
                        : p.type === "onboarding"
                          ? "Onboarding Credits"
                          : p.type}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(p.timeCreated)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    ${p.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p
                    className={`text-xs capitalize ${
                      p.status === "captured" ? "text-green-500" : p.status === "failed" ? "text-red-500" : "text-muted-foreground"
                    }`}
                  >
                    {p.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
