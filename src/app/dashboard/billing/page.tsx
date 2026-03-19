"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import { useBillingRealtime } from "@/hooks/use-billing-realtime";
import {
  CreditCard,
  Plus,
  Zap,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  X,
  Info,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ExternalLink,
  Check,
  Settings2,
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
  credits?: { added: number; spent: number; balance: number } | null;
  spendLimit: number | null;
  planLimit: number | null;
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
  cardBrand?: string | null;
  cardLastFour?: string | null;
  updatePaymentUrl?: string | null;
  renewsAt?: string | null;
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

// Fallback plan definitions — used until API responds
const PLAN_DEFS_FALLBACK = [
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

// Annual billing toggle removed — add back after setting up annual LS variants

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
  const [planDefs, setPlanDefs] = useState(PLAN_DEFS_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [addingCredits, setAddingCredits] = useState(false);
  const [creditAmount, setCreditAmount] = useState(5);
  const [confirmAction, setConfirmAction] = useState<{
    type: "downgrade" | "cancel" | "reset";
    plan?: string;
  } | null>(null);
  const [changingPlan, setChangingPlan] = useState(false);
  const [subscribingPlan, setSubscribingPlan] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"billing" | "invoices">("billing");
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitInput, setLimitInput] = useState("");
  const [savingLimit, setSavingLimit] = useState(false);
  // billingPeriod removed — annual billing not yet wired to API

  const { toasts, push: pushToast, dismiss: dismissToast } = useToasts();
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
    // Fetch plan definitions separately (non-blocking, cacheable)
    api.getPlans().then(({ plans }) => {
      if (plans.length > 0) {
        setPlanDefs(plans);
      }
    }).catch(() => {/* keep fallback */});
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time billing updates via Supabase Realtime
  useBillingRealtime(fetchData);

  // Check URL params for post-checkout redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success" || params.get("subscription") === "success") {
      pushToast({
        variant: "success",
        title: "Payment successful!",
        description: "Your account has been updated.",
      });
      window.history.replaceState({}, "", window.location.pathname);
      const timer = setTimeout(() => fetchData(), 2000);
      return () => clearTimeout(timer);
    }
    if (params.get("action") === "spend-limit") {
      setShowLimitModal(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Warning toasts
  useEffect(() => {
    if (!quota) return;

    if (quota.warnings.includes("using_credits") && !shownWarningsRef.current.has("using_credits")) {
      shownWarningsRef.current.add("using_credits");
      pushToast({
        variant: "warning",
        title: "Using top-up credits",
        description: "Plan allowance exceeded — using top-up credits for overage.",
      });
    }

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

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showPlanModal) setShowPlanModal(false);
        if (showLimitModal) setShowLimitModal(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showPlanModal, showLimitModal]);

  // ── Handlers ──

  const handleAddCredits = async () => {
    setAddingCredits(true);
    try {
      const result = await api.addCredits(creditAmount);
      window.open(result.checkoutUrl, "_blank");
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

  const handleSubscribe = async (planId: "starter" | "pro" | "team") => {
    setSubscribingPlan(planId);
    try {
      const result = await api.subscribe(planId);
      window.open(result.checkoutUrl, "_blank");
    } catch (err) {
      pushToast({
        variant: "error",
        title: "Subscription failed",
        description: err instanceof Error ? err.message : "Failed to create subscription.",
      });
    } finally {
      setSubscribingPlan(null);
    }
  };

  const handleChangePlan = async (planId: "starter" | "pro" | "team") => {
    if (!subscription?.active) {
      handleSubscribe(planId);
      return;
    }

    const currentIdx = planDefs.findIndex((p) => p.id === currentPlanId);
    const newIdx = planDefs.findIndex((p) => p.id === planId);
    const isDowngrade = newIdx < currentIdx;

    if (isDowngrade) {
      setConfirmAction({ type: "downgrade", plan: planId });
      return;
    }

    setChangingPlan(true);
    try {
      await api.changePlan(planId);
      pushToast({
        variant: "success",
        title: "Plan upgraded!",
        description: "Your account has been updated.",
      });
      setShowPlanModal(false);
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
      setShowPlanModal(false);
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

  const handleResetBilling = async () => {
    setResetting(true);
    setConfirmAction(null);
    try {
      await api.resetBillingTest();
      pushToast({
        variant: "success",
        title: "Billing reset",
        description: "All billing data cleared. You are on the Free plan.",
      });
      shownWarningsRef.current.clear();
      await fetchData();
    } catch (err) {
      pushToast({
        variant: "error",
        title: "Reset failed",
        description: err instanceof Error ? err.message : "Failed to reset.",
      });
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  // ── Spend Limit Handlers ──

  const handleOpenLimitModal = () => {
    setLimitInput(quota?.spendLimit != null ? String(quota.spendLimit) : "");
    setShowLimitModal(true);
  };

  const handleSetLimit = async () => {
    const amount = Number(limitInput);
    if (isNaN(amount) || amount < 0) return;
    setSavingLimit(true);
    try {
      await api.setMonthlyLimit(amount);
      setShowLimitModal(false);
      pushToast({ variant: "success", title: "Spend limit updated" });
      fetchData();
    } catch (err: unknown) {
      pushToast({ variant: "error", title: "Failed to update limit", description: (err as Error).message });
    } finally {
      setSavingLimit(false);
    }
  };

  const handleRemoveLimit = async () => {
    setSavingLimit(true);
    try {
      await api.setMonthlyLimit(null);
      setShowLimitModal(false);
      pushToast({ variant: "success", title: "Spend limit removed", description: "Using plan default limit." });
      fetchData();
    } catch (err: unknown) {
      pushToast({ variant: "error", title: "Failed to remove limit", description: (err as Error).message });
    } finally {
      setSavingLimit(false);
    }
  };

  const monthlyPct = quota?.monthly.pct;

  return (
    <div className="p-8">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your plan, credits, and invoices
        </p>
      </div>

      {/* Confirmation Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl">
            <h3 className="font-semibold">
              {confirmAction.type === "reset"
                ? "Reset All Billing Data?"
                : confirmAction.type === "cancel"
                  ? "Cancel Subscription?"
                  : `Downgrade to ${confirmAction.plan?.charAt(0).toUpperCase()}${confirmAction.plan?.slice(1)}?`}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {confirmAction.type === "reset"
                ? "This will cancel your subscription, delete all payment history, and reset credits to $0. You'll be on the Free plan. This cannot be undone."
                : confirmAction.type === "cancel"
                  ? "Your subscription will remain active until the end of your current billing cycle, then revert to the Free plan. Your credits will be preserved."
                  : "Your plan will change at the end of your current billing cycle. You'll keep your current plan limits until then. Credits are preserved."}
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 cursor-pointer rounded-lg border border-border py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                {confirmAction.type === "reset" ? "Cancel" : "Keep Current"}
              </button>
              <button
                onClick={confirmAction.type === "reset" ? handleResetBilling : confirmAction.type === "cancel" ? handleCancelSubscription : confirmDowngrade}
                disabled={changingPlan || resetting}
                className="flex-1 cursor-pointer rounded-lg bg-red-500 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {changingPlan || resetting ? "Processing..." : confirmAction.type === "reset" ? "Reset Everything" : confirmAction.type === "cancel" ? "Cancel" : "Downgrade"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Plan Modal */}
      {showPlanModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPlanModal(false);
          }}
        >
          <div className="mx-4 w-full max-w-5xl overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl shadow-black/40">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-8 py-5">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Adjust your plan</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">Choose the plan that works best for you</p>
              </div>
              <button
                onClick={() => setShowPlanModal(false)}
                className="cursor-pointer rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-8 py-6">
              {/* Plan Cards */}
              <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {planDefs.map((plan) => {
                  const isCurrent = plan.id === currentPlanId;
                  const isPending = subscription?.pendingPlan === plan.id;
                  const currentIdx = planDefs.findIndex((p) => p.id === currentPlanId);
                  const planIdx = planDefs.findIndex((p) => p.id === plan.id);
                  const isUpgrade = planIdx > currentIdx;
                  const isDowngrade = planIdx < currentIdx && planIdx > 0;
                  const isFree = plan.id === "free";
                  const displayPrice = plan.price;

                  return (
                    <div
                      key={plan.id}
                      className={`relative flex flex-col rounded-2xl border p-5 transition-all ${
                        isCurrent
                          ? "border-foreground/25 bg-foreground/[0.04] ring-1 ring-foreground/10"
                          : "border-border/60 bg-card hover:border-border"
                      }`}
                    >
                      {/* Plan name + badge */}
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-bold">{plan.name}</h3>
                        {isCurrent && (
                          <span className="rounded-full bg-foreground/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Current
                          </span>
                        )}
                        {isPending && (
                          <span className="rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-blue-400">
                            Pending
                          </span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="mt-4">
                        {isFree ? (
                          <div className="flex items-baseline">
                            <span className="text-4xl font-bold tracking-tight">$0</span>
                            <span className="ml-1 text-sm text-muted-foreground">/mo</span>
                          </div>
                        ) : (
                          <div className="flex items-baseline">
                            <span className="text-4xl font-bold tracking-tight">
                              ${displayPrice.toFixed(2)}
                            </span>
                            <span className="ml-1 text-sm text-muted-foreground">/mo</span>
                          </div>
                        )}
                        {!isFree && (
                          <p className="mt-1 text-xs text-muted-foreground">Billed monthly</p>
                        )}
                        {isFree && (
                          <p className="mt-1 text-xs text-muted-foreground">Free forever</p>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="my-4 h-px bg-border/60" />

                      {/* Features */}
                      <ul className="flex-1 space-y-2.5">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500/70" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Action buttons */}
                      <div className="mt-5">
                        {!isCurrent && !isFree && isPending && (
                          <button
                            onClick={handleCancelPendingChange}
                            disabled={changingPlan}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-500/30 py-2.5 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-500/10 disabled:opacity-50"
                          >
                            <X className="h-3.5 w-3.5" /> Cancel Downgrade
                          </button>
                        )}
                        {!isCurrent && !isFree && !isPending && (
                          <button
                            onClick={() => {
                              handleChangePlan(plan.id as "starter" | "pro" | "team");
                            }}
                            disabled={changingPlan || !!subscription?.pendingPlan || subscribingPlan === plan.id}
                            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all disabled:opacity-50 ${
                              isUpgrade
                                ? "bg-foreground text-background hover:opacity-90"
                                : "border border-border hover:bg-muted"
                            }`}
                          >
                            {subscribingPlan === plan.id ? (
                              <span className="flex items-center gap-2">
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Loading...
                              </span>
                            ) : !subscription?.active ? (
                              "Get Started"
                            ) : isUpgrade ? (
                              <>
                                <ArrowUp className="h-3.5 w-3.5" /> Upgrade
                              </>
                            ) : isDowngrade ? (
                              <>
                                <ArrowDown className="h-3.5 w-3.5" /> Downgrade
                              </>
                            ) : (
                              "Get Started"
                            )}
                          </button>
                        )}
                        {isCurrent && !isFree && (
                          <div className="flex w-full items-center justify-center rounded-xl border border-border/60 py-2.5 text-sm font-medium text-muted-foreground">
                            Current Plan
                          </div>
                        )}
                        {isFree && !isCurrent && (
                          <div className="flex w-full items-center justify-center rounded-xl border border-border/40 py-2.5 text-sm font-medium text-muted-foreground/60">
                            Free tier
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border px-8 py-4">
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                Upgrades take effect immediately with prorated billing. Downgrades apply at the end of your billing cycle. All prices in USD.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Bar */}
      <div className="mb-6 flex gap-1 border-b border-border">
        <button
          onClick={() => setActiveTab("billing")}
          className={`cursor-pointer px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "billing"
              ? "border-b-2 border-foreground text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Billing
        </button>
        <button
          onClick={() => setActiveTab("invoices")}
          className={`cursor-pointer px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "invoices"
              ? "border-b-2 border-foreground text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Invoices
        </button>
      </div>

      {/* ═══ BILLING TAB ═══ */}
      {activeTab === "billing" && (
        <div className="space-y-6">
          {/* Plan Status Card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-medium text-muted-foreground">Your plan</h2>
                <div className="mt-1 flex items-center gap-2.5">
                  <span className="text-xl font-bold capitalize">
                    {subscription?.active
                      ? subscription.planName ?? subscription.plan
                      : quota?.plan?.name ?? "Free"}
                  </span>
                  {subscription?.active && subscription.price ? (
                    <span className="text-sm text-muted-foreground">
                      ${subscription.price}/month
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Free tier</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowPlanModal(true)}
                className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                Adjust plan
              </button>
            </div>

            {/* Usage + Credits Row */}
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {/* Usage */}
              <div>
                <div className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Monthly Usage</span>
                </div>
                {quota?.monthly.max !== null && quota?.monthly.max !== undefined ? (
                  <>
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="text-lg font-semibold">
                        {formatCurrency(quota!.monthly.current)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / {formatCurrency(quota!.monthly.max)}
                      </span>
                      {quota?.overageActive && (
                        <span className="ml-1 text-xs text-orange-500">(overage)</span>
                      )}
                    </div>
                    <div className="mt-1.5 h-2 w-full rounded-full bg-muted dark:bg-zinc-800">
                      <div
                        className={`h-2 rounded-full transition-all ${
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
                      Resets {quota!.monthly.resetsAt ? formatDate(quota!.monthly.resetsAt) : "next month"}
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-lg font-semibold">
                    {quota ? formatCurrency(quota.monthly.current) : "—"}
                    <span className="ml-1.5 text-sm font-normal text-muted-foreground">No limit</span>
                  </p>
                )}
              </div>

              {/* Credit Balance */}
              <div>
                <div className="flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Credit Balance</span>
                </div>
                <p className="mt-2 text-lg font-semibold">
                  {quota ? formatCurrency(quota.balance) : "—"}
                  <span className="ml-1.5 text-sm font-normal text-muted-foreground">remaining</span>
                </p>
                {quota?.credits && (quota.credits.added > 0 || quota.credits.spent > 0) ? (
                  <>
                    {quota.credits.added > 0 && (() => {
                      const remainingPct = Math.min((quota.credits.balance / quota.credits.added) * 100, 100);
                      return (
                        <div className="mt-2 h-2 w-full rounded-full bg-muted dark:bg-zinc-800">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              remainingPct < 10
                                ? "bg-red-500"
                                : remainingPct < 30
                                  ? "bg-amber-500"
                                  : "bg-blue-500"
                            }`}
                            style={{ width: `${remainingPct}%` }}
                          />
                        </div>
                      );
                    })()}
                    <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatCurrency(quota.credits.added)} added</span>
                      <span>{formatCurrency(quota.credits.spent)} spent</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Resets {quota.monthly.resetsAt ? formatDate(quota.monthly.resetsAt) : "next month"}
                    </p>
                  </>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">
                    No credit usage this month
                  </p>
                )}
              </div>
            </div>

            {/* Renewal / Grace / Pending info */}
            <div className="mt-5 border-t border-border pt-4">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                {subscription?.active && subscription.renewsAt && !subscription.graceUntil && (
                  <span className="text-muted-foreground">
                    Next renewal: <span className="text-foreground">{formatDate(subscription.renewsAt)}</span>
                  </span>
                )}
                {subscription?.graceUntil && (
                  <span className="text-amber-500">
                    Cancels on {formatDate(subscription.graceUntil)}
                  </span>
                )}
                {subscription?.pendingPlan && subscription.pendingPlanEffectiveAt && (
                  <span className="text-blue-400">
                    Downgrades to {subscription.pendingPlan.charAt(0).toUpperCase() + subscription.pendingPlan.slice(1)} on {formatDate(subscription.pendingPlanEffectiveAt)}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="mt-3 flex items-center gap-4">
                {subscription?.active && subscription.graceUntil && (
                  <button
                    onClick={handleResumeSubscription}
                    disabled={changingPlan}
                    className="cursor-pointer text-sm font-medium text-foreground hover:underline disabled:opacity-50"
                  >
                    Resume subscription
                  </button>
                )}
                {subscription?.active && !subscription.graceUntil && (
                  <button
                    onClick={() => setConfirmAction({ type: "cancel" })}
                    className="cursor-pointer text-sm text-red-500/70 hover:text-red-500"
                  >
                    Cancel subscription
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-medium text-muted-foreground">Payment method</h3>
            {subscription?.active && subscription.cardBrand ? (
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">
                    {subscription.cardBrand} ending in {subscription.cardLastFour}
                  </span>
                </div>
                {subscription.updatePaymentUrl && (
                  <a
                    href={subscription.updatePaymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex cursor-pointer items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Manage <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                No payment method on file. Subscribe to a plan to add one.
              </p>
            )}
          </div>

          {/* Monthly Spend Limit */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <Settings2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <h2 className="font-semibold">Monthly Spend Limit</h2>
                </div>
                <p className="mt-2 text-lg font-semibold">
                  {quota?.spendLimit != null
                    ? formatCurrency(quota.spendLimit)
                    : "No limit"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {quota?.spendLimit != null
                    ? "Custom monthly spending cap is active."
                    : `Using plan default${quota?.planLimit ? ` (${formatCurrency(quota.planLimit)}/month)` : ""}.`}
                </p>
              </div>
              <button
                onClick={handleOpenLimitModal}
                className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                Adjust limit
              </button>
            </div>
          </div>

          {/* Add Credits */}
          <div className="rounded-xl border border-border bg-card p-5">
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
                    className={`cursor-pointer rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
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
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5" />
                {addingCredits ? "Processing..." : "Add Credits"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ INVOICES TAB ═══ */}
      {activeTab === "invoices" && (
        <div className="space-y-6">
          {/* Payment History */}
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-semibold">Payment History</h2>
            </div>
            {payments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <Clock className="mb-2 h-6 w-6" />
                <p className="text-sm">No payments yet</p>
              </div>
            ) : (
              <>
                {/* Table header */}
                <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-border px-5 py-2.5 text-xs font-medium text-muted-foreground sm:grid-cols-[1fr_100px_100px_100px_100px]">
                  <span>Date</span>
                  <span className="hidden sm:block">Type</span>
                  <span>Status</span>
                  <span className="text-right">Amount</span>
                  <span className="w-6" />
                </div>

                {/* Table rows */}
                <div className="divide-y divide-border">
                  {payments.map((p) => {
                    const isExpanded = expandedPayment === p.id;
                    const statusColor =
                      p.status === "captured"
                        ? "bg-green-500/10 text-green-500"
                        : p.status === "failed"
                          ? "bg-red-500/10 text-red-500"
                          : p.status === "refunded"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-muted text-muted-foreground";

                    const productLabel = p.upgrade
                      ? `Upgrade · ${p.upgrade.from} → ${p.upgrade.to}`
                      : p.type === "onboarding"
                        ? "Onboarding Credits"
                        : p.type === "credits"
                          ? "Credits Top-Up"
                          : p.type === "subscription"
                            ? "Monthly Subscription"
                            : p.type === "refund"
                              ? "Refund"
                              : p.type;

                    return (
                      <div key={p.id}>
                        <button
                          onClick={() => setExpandedPayment(isExpanded ? null : p.id)}
                          className="grid w-full grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-muted/50 sm:grid-cols-[1fr_100px_100px_100px_100px]"
                        >
                          <span className="text-sm">{formatDate(p.timeCreated)}</span>
                          <span className="hidden text-sm capitalize text-muted-foreground sm:block">
                            {p.type}
                          </span>
                          <span>
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusColor}`}>
                              {p.status === "captured" && <CheckCircle2 className="h-3 w-3" />}
                              {p.status === "captured" ? "Paid" : p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                            </span>
                          </span>
                          <span className="text-right text-sm font-medium">
                            ${p.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span className="flex justify-end">
                            <ChevronDown
                              className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            />
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="border-t border-border bg-muted/30 px-5 py-4">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div className="space-y-2.5">
                                <div>
                                  <p className="text-xs text-muted-foreground">Product</p>
                                  <p className="text-sm font-medium capitalize">{productLabel}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Date</p>
                                  <p className="text-sm">{new Date(p.timeCreated).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Transaction ID</p>
                                  <p className="font-mono text-xs text-muted-foreground">{p.id}</p>
                                </div>
                              </div>
                              <div className="space-y-2.5">
                                <div>
                                  <p className="text-xs text-muted-foreground">Amount</p>
                                  <p className="text-sm font-medium">
                                    ${p.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {p.currency}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Status</p>
                                  <p className={`text-sm capitalize ${p.status === "captured" ? "text-green-500" : p.status === "failed" ? "text-red-500" : "text-muted-foreground"}`}>
                                    {p.status === "captured" ? "Paid" : p.status}
                                  </p>
                                </div>
                                {p.upgrade && (
                                  <div>
                                    <p className="text-xs text-muted-foreground">Plan Change</p>
                                    <p className="text-sm">
                                      <span className="capitalize">{p.upgrade.from}</span>
                                      {" → "}
                                      <span className="font-medium capitalize">{p.upgrade.to}</span>
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Test Reset — visible on both tabs */}
      <div className="mt-8 rounded-xl border border-red-500/20 bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-red-400">Test Reset</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Wipe all billing data (subscription, payments, credits) and start fresh.
            </p>
          </div>
          <button
            onClick={() => setConfirmAction({ type: "reset" })}
            disabled={resetting}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {resetting ? "Resetting..." : "Reset"}
          </button>
        </div>
      </div>

      {/* Spend Limit Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowLimitModal(false)}>
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Set monthly spend limit</h2>
              <button onClick={() => setShowLimitModal(false)} className="cursor-pointer rounded-lg p-1 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              You can set a maximum amount you can spend on extra usage per month.
            </p>

            <div className="mt-4">
              <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 focus-within:border-foreground/50">
                <span className="text-sm text-muted-foreground">$</span>
                <input
                  type="number"
                  value={limitInput}
                  onChange={(e) => setLimitInput(e.target.value)}
                  min={0}
                  step={1}
                  placeholder={quota?.planLimit ? String(quota.planLimit) : "0"}
                  className="w-full bg-transparent text-sm outline-none"
                  autoFocus
                />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                This spend limit goes into effect immediately.
                {quota?.planLimit ? ` Plan default: ${formatCurrency(quota.planLimit)}/month.` : ""}
              </p>
              {limitInput === "0" && (
                <p className="mt-1 text-xs text-amber-500">
                  Setting to $0 will prevent all AI usage.
                </p>
              )}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={handleRemoveLimit}
                disabled={savingLimit}
                className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
              >
                Set to unlimited
              </button>
              <button
                onClick={handleSetLimit}
                disabled={savingLimit || limitInput === ""}
                className="flex-1 cursor-pointer rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {savingLimit ? "Saving..." : "Set spend limit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
