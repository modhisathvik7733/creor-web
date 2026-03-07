"use client";

import { useEffect, useState, useCallback } from "react";
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
} from "lucide-react";

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

export default function BillingPage() {
  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingCredits, setAddingCredits] = useState(false);
  const [creditAmount, setCreditAmount] = useState(5);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: "downgrade" | "cancel";
    plan?: string;
  } | null>(null);
  const [changingPlan, setChangingPlan] = useState(false);

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
      setPaymentSuccess(true);
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
      // Refresh data (webhook may take a moment)
      const timer = setTimeout(() => fetchData(), 2000);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Add Credits ──
  const handleAddCredits = async () => {
    setAddingCredits(true);
    setError(null);
    try {
      const result = await api.addCredits(creditAmount);
      window.location.href = result.checkoutUrl;
    } catch {
      setError("Failed to create checkout. Please try again.");
    } finally {
      setAddingCredits(false);
    }
  };

  // ── Subscribe (new subscription) ──
  const handleSubscribe = async (planId: "starter" | "pro" | "team") => {
    setError(null);
    try {
      const result = await api.subscribe(planId);
      window.location.href = result.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create subscription.");
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
    setError(null);
    try {
      await api.changePlan(planId);
      setPaymentSuccess(true);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change plan.");
    } finally {
      setChangingPlan(false);
    }
  };

  const confirmDowngrade = async () => {
    if (!confirmAction?.plan) return;
    setChangingPlan(true);
    setError(null);
    setConfirmAction(null);
    try {
      await api.changePlan(confirmAction.plan as "starter" | "pro" | "team");
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to downgrade.");
    } finally {
      setChangingPlan(false);
    }
  };

  // ── Cancel Subscription ──
  const handleCancelSubscription = async () => {
    setChangingPlan(true);
    setError(null);
    setConfirmAction(null);
    try {
      await api.cancelSubscription();
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel subscription.");
    } finally {
      setChangingPlan(false);
    }
  };

  // ── Resume Subscription ──
  const handleResumeSubscription = async () => {
    setChangingPlan(true);
    setError(null);
    try {
      await api.resumeSubscription();
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resume subscription.");
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your plan and credits
        </p>
      </div>

      {/* Payment Success Banner */}
      {paymentSuccess && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
          <div>
            <p className="font-medium text-green-500">Payment successful!</p>
            <p className="text-sm text-green-500/80">Your account has been updated.</p>
          </div>
          <button onClick={() => setPaymentSuccess(false)} className="ml-auto text-sm text-green-500/60 hover:text-green-500">
            Dismiss
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <p className="font-medium text-red-500">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-sm text-red-500/60 hover:text-red-500">
            Dismiss
          </button>
        </div>
      )}

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

      {/* Warnings */}
      {quota?.warnings.includes("using_credits") && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
          <p className="text-sm font-medium text-amber-500">
            Plan allowance exceeded — using top-up credits for overage.
          </p>
        </div>
      )}
      {quota?.warnings.includes("monthly_approaching") && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
          <p className="text-sm font-medium text-amber-500">
            You&apos;ve used {monthlyPct}% of your plan allowance. Resets{" "}
            {quota.monthly.resetsAt ? formatDate(quota.monthly.resetsAt) : "next month"}.
            {quota.balance <= 0 && " Add credits to continue after the limit."}
          </p>
        </div>
      )}
      {/* Blocked Banner */}
      {quota && !quota.canSend && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <div>
            <p className="font-medium text-red-500">
              {quota.blockReason === "free_limit_no_credits"
                ? "Free tier limit reached"
                : quota.blockReason === "limit_no_credits"
                  ? "Plan limit reached"
                  : "Sending blocked"}
            </p>
            <p className="text-sm text-red-500/80">
              {quota.blockReason === "free_limit_no_credits"
                ? "Subscribe to a plan or add credits to continue."
                : quota.blockReason === "limit_no_credits"
                  ? "Add credits or upgrade your plan to continue."
                  : `Usage resets ${quota.monthly.resetsAt ? formatDate(quota.monthly.resetsAt) : "next month"}.`}
            </p>
          </div>
        </div>
      )}

      {/* Grace Period Notice */}
      {subscription?.active && subscription.graceUntil && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <Clock className="h-5 w-5 shrink-0 text-amber-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-500">
              Subscription cancelled — access until {formatDate(subscription.graceUntil)}.
            </p>
          </div>
          <button
            onClick={handleResumeSubscription}
            disabled={changingPlan}
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 px-3 py-1.5 text-xs font-medium text-amber-500 transition-colors hover:bg-amber-500/10 disabled:opacity-50"
          >
            <RotateCcw className="h-3 w-3" /> Resume
          </button>
        </div>
      )}

      {/* Pending Downgrade Notice */}
      {subscription?.pendingPlan && subscription.pendingPlanEffectiveAt && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
          <ArrowDown className="h-5 w-5 shrink-0 text-blue-500" />
          <p className="text-sm font-medium text-blue-500">
            Downgrading to {subscription.pendingPlan.charAt(0).toUpperCase() + subscription.pendingPlan.slice(1)} on{" "}
            {formatDate(subscription.pendingPlanEffectiveAt)}.
          </p>
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
                className={`rounded-xl border p-5 ${
                  isCurrent
                    ? "border-foreground/30 bg-foreground/5"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{plan.name}</h3>
                  {isCurrent && (
                    <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                      Current
                    </span>
                  )}
                  {isPending && (
                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-blue-500">
                      Pending
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
                {!isCurrent && !isFree && (
                  <button
                    onClick={() => handleChangePlan(plan.id as "starter" | "pro" | "team")}
                    disabled={changingPlan || isPending}
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
                          : p.type === "subscription"
                            ? "bg-purple-500/10 text-purple-500"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {p.type === "onboarding" ? "OB" : p.type === "credits" ? "CR" : p.type === "subscription" ? "SB" : "RF"}
                  </div>
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {p.type === "onboarding" ? "Onboarding Credits" : p.type}
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
