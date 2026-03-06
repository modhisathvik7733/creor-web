"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  CreditCard,
  Plus,
  Zap,
  AlertCircle,
  CheckCircle2,
  Wallet,
  Clock,
  ArrowRightLeft,
  ChevronDown,
  Receipt,
} from "lucide-react";

type SupportedCurrency = "USD" | "INR" | "EUR";

interface QuotaInfo {
  balance: number;
  currency: string;
  symbol: string;
  plan: { id: string; name: string; price: number | null } | null;
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
  exchangeRates: Record<string, number>;
}

interface Subscription {
  active: boolean;
  plan?: string;
  planName?: string;
  price?: number;
  currency?: string;
  graceUntil?: string | null;
}

interface Payment {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  timeCreated: string;
}

const CURRENCIES: { id: SupportedCurrency; label: string; symbol: string }[] = [
  { id: "USD", label: "US Dollar", symbol: "$" },
  { id: "INR", label: "Indian Rupee", symbol: "₹" },
  { id: "EUR", label: "Euro", symbol: "€" },
];

const CREDIT_PRESETS: Record<SupportedCurrency, number[]> = {
  USD: [5, 10, 25, 50],
  INR: [500, 1000, 2500, 5000],
  EUR: [5, 10, 25, 50],
};

const MIN_CREDIT: Record<SupportedCurrency, number> = {
  USD: 1,
  INR: 100,
  EUR: 1,
};

function formatCurrency(amount: number, currency: string, symbol: string): string {
  if (currency === "INR") {
    return `${symbol}${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BillingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [dbPlans, setDbPlans] = useState<
    Array<{ id: string; name: string; prices: Record<string, number>; features: string[]; monthlyLimit: number | null }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [addingCredits, setAddingCredits] = useState(false);
  const [creditAmount, setCreditAmount] = useState(500);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [switchingCurrency, setSwitchingCurrency] = useState(false);

  const currency = (quota?.currency ?? "INR") as SupportedCurrency;
  const symbol = quota?.symbol ?? "₹";

  // Load Razorpay checkout script
  useEffect(() => {
    if (document.querySelector('script[src*="razorpay"]')) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

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
      // Set default credit amount based on currency
      const cur = (q.currency ?? "INR") as SupportedCurrency;
      setCreditAmount(CREDIT_PRESETS[cur]?.[0] ?? 500);
    } catch {
      // silently fail — auth redirect handled by api client
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch plans from admin config (public models endpoint gives us info)
  useEffect(() => {
    // Plans are fetched from the admin API if user is owner, otherwise use hardcoded fallback
    // For now, we read plans from the quota response or use sensible defaults
    setDbPlans([
      {
        id: "starter",
        name: "Starter",
        prices: { USD: 599, INR: 49900, EUR: 549 },
        features: ["All models", "Email support", "6 USD monthly limit"],
        monthlyLimit: 6000000,
      },
      {
        id: "pro",
        name: "Pro",
        prices: { USD: 2399, INR: 199900, EUR: 2199 },
        features: ["All models", "Priority models", "Priority support", "24 USD monthly limit"],
        monthlyLimit: 24000000,
      },
      {
        id: "team",
        name: "Team",
        prices: { USD: 5999, INR: 499900, EUR: 5499 },
        features: ["All models", "Priority models", "Dedicated support", "Admin roles", "60 USD monthly limit"],
        monthlyLimit: 60000000,
      },
    ]);
  }, []);

  // Activate pending subscription — runs on every page load AND on redirect
  useEffect(() => {
    const isPaymentReturn = searchParams.get("payment") === "success";
    if (isPaymentReturn) {
      router.replace("/dashboard/billing", { scroll: false });
    }

    const pendingSubId = localStorage.getItem("creor_pending_subscription");
    if (!pendingSubId && !isPaymentReturn) return;

    const activate = async () => {
      if (pendingSubId) {
        localStorage.removeItem("creor_pending_subscription");
        try {
          await api.activateSubscription(pendingSubId);
        } catch {
          // Webhook may handle it, or it may already be active
        }
      }

      // Refresh data after activation
      try {
        const [q, s, p] = await Promise.all([
          api.getQuota(),
          api.getSubscription(),
          api.getPayments(),
        ]);
        setQuota(q);
        setSubscription(s);
        setPayments(p.payments);
        const cur = (q.currency ?? "INR") as SupportedCurrency;
        setCreditAmount(CREDIT_PRESETS[cur]?.[0] ?? 500);
        if (isPaymentReturn || s.active) setPaymentSuccess(true);

        // If subscription still not showing, poll a few times
        if (pendingSubId && !s.active) {
          let attempts = 0;
          const poll = setInterval(async () => {
            attempts++;
            try {
              await api.activateSubscription(pendingSubId).catch(() => {});
              const [q2, s2] = await Promise.all([api.getQuota(), api.getSubscription()]);
              setQuota(q2);
              setSubscription(s2);
              if (s2.active || attempts >= 8) clearInterval(poll);
            } catch {
              clearInterval(poll);
            }
          }, 3000);
          return () => clearInterval(poll);
        }
      } catch {
        // Best effort
      }
    };

    activate();
  }, [searchParams, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddCredits = async () => {
    setAddingCredits(true);
    setError(null);
    try {
      const order = await api.addCredits(creditAmount);

      const options = {
        key: order.keyId,
        amount: order.amountSmallest,
        currency: order.currency,
        name: "Creor",
        description: `Add ${order.symbol ?? symbol}${creditAmount} credits`,
        order_id: order.orderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await api.verifyPayment(response);
            setPaymentSuccess(true);
            await fetchData();
          } catch {
            setError("Payment verification failed. Contact support if charged.");
          }
        },
        modal: {
          ondismiss: () => setAddingCredits(false),
        },
        theme: { color: "#171717" },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as unknown as Record<string, any>).Razorpay(options);
      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setAddingCredits(false);
      });
      rzp.open();
    } catch {
      setError("Failed to create order");
      setAddingCredits(false);
    }
  };

  const handleSubscribe = async (planId: "starter" | "pro" | "team") => {
    setError(null);
    try {
      const result = await api.subscribe(planId);

      const options = {
        key: result.keyId,
        subscription_id: result.subscriptionId,
        name: "Creor",
        description: `${result.plan.charAt(0).toUpperCase() + result.plan.slice(1)} Plan — ${result.currency} ${result.price}/mo`,
        handler: async () => {
          // Payment successful — activate subscription
          try {
            await api.activateSubscription(result.subscriptionId);
          } catch {
            // May already be active via webhook
          }
          setPaymentSuccess(true);
          // Poll until subscription reflects in the API
          for (let i = 0; i < 6; i++) {
            await new Promise((r) => setTimeout(r, 1000));
            try {
              const [q, s, p] = await Promise.all([
                api.getQuota(),
                api.getSubscription(),
                api.getPayments(),
              ]);
              setQuota(q);
              setSubscription(s);
              setPayments(p.payments);
              if (s.active) break;
              // Retry activation if not yet active
              await api.activateSubscription(result.subscriptionId).catch(() => {});
            } catch {
              break;
            }
          }
        },
        modal: {
          ondismiss: () => {
            // User closed checkout — store for activation on next visit
            localStorage.setItem("creor_pending_subscription", result.subscriptionId);
          },
        },
        theme: { color: "#171717" },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as unknown as Record<string, any>).Razorpay(options);
      rzp.on("payment.failed", () => {
        setError("Subscription payment failed. Please try again.");
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create subscription. Please try again.");
    }
  };

  const handleSwitchCurrency = async (newCurrency: SupportedCurrency) => {
    if (newCurrency === currency || switchingCurrency) return;
    setSwitchingCurrency(true);
    setError(null);
    try {
      await api.patchCurrency(newCurrency);
      await fetchData();
      setShowCurrencyPicker(false);
    } catch {
      setError("Failed to switch currency. Try again.");
    } finally {
      setSwitchingCurrency(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  const presets = CREDIT_PRESETS[currency] ?? CREDIT_PRESETS.USD;
  const minCredit = MIN_CREDIT[currency] ?? 1;
  const monthlyPct = quota?.monthly.pct;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your credits, plan, and currency
          </p>
        </div>
        {/* Currency Selector */}
        <div className="relative">
          <button
            onClick={() => setShowCurrencyPicker(!showCurrencyPicker)}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-muted"
          >
            <ArrowRightLeft className="h-3.5 w-3.5 text-muted-foreground" />
            {CURRENCIES.find((c) => c.id === currency)?.symbol} {currency}
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>
          {showCurrencyPicker && (
            <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-border bg-card shadow-lg">
              {CURRENCIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSwitchCurrency(c.id)}
                  disabled={switchingCurrency}
                  className={`flex w-full items-center justify-between px-3 py-2.5 text-sm transition-colors hover:bg-muted first:rounded-t-lg last:rounded-b-lg ${
                    c.id === currency ? "font-medium text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <span>
                    {c.symbol} {c.label}
                  </span>
                  {c.id === currency && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  )}
                </button>
              ))}
              {switchingCurrency && (
                <div className="flex items-center justify-center border-t border-border py-2">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-border border-t-foreground" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Success Banner */}
      {paymentSuccess && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
          <div>
            <p className="font-medium text-green-500">Payment successful!</p>
            <p className="text-sm text-green-500/80">
              Your account has been updated. It may take a moment to reflect.
            </p>
          </div>
          <button
            onClick={() => setPaymentSuccess(false)}
            className="ml-auto text-sm text-green-500/60 hover:text-green-500"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <p className="font-medium text-red-500">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-sm text-red-500/60 hover:text-red-500"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Warnings */}
      {quota?.warnings.includes("low_balance") && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
          <p className="text-sm font-medium text-amber-500">
            Low balance — add credits to continue using AI models.
          </p>
        </div>
      )}
      {quota?.warnings.includes("monthly_approaching") && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
          <p className="text-sm font-medium text-amber-500">
            You&apos;ve used {monthlyPct}% of your monthly limit. Resets{" "}
            {quota.monthly.resetsAt
              ? formatDate(quota.monthly.resetsAt)
              : "next month"}
            .
          </p>
        </div>
      )}

      {/* Blocked Banner */}
      {quota && !quota.canSend && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <div>
            <p className="font-medium text-red-500">
              {quota.blockReason === "credits"
                ? "Insufficient credits"
                : quota.blockReason === "monthly"
                  ? "Monthly limit reached"
                  : "Sending blocked"}
            </p>
            <p className="text-sm text-red-500/80">
              {quota.blockReason === "credits"
                ? "Add credits below to continue using AI models."
                : quota.blockReason === "monthly"
                  ? `Your usage will reset ${quota.monthly.resetsAt ? formatDate(quota.monthly.resetsAt) : "next month"}.`
                  : "Please contact support."}
            </p>
          </div>
        </div>
      )}

      {/* Balance, Monthly Usage & Plan Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Balance</span>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">
            {quota ? formatCurrency(quota.balance, currency, symbol) : "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Available credits</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Monthly Usage</span>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">
            {quota
              ? formatCurrency(quota.monthly.current, currency, symbol)
              : "—"}
          </p>
          {quota?.monthly.max !== null && quota?.monthly.max !== undefined ? (
            <>
              <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    (monthlyPct ?? 0) >= 90
                      ? "bg-red-500"
                      : (monthlyPct ?? 0) >= 70
                        ? "bg-amber-500"
                        : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(monthlyPct ?? 0, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatCurrency(quota!.monthly.current, currency, symbol)} /{" "}
                {formatCurrency(quota!.monthly.max, currency, symbol)}
                {quota!.monthly.resetsAt && (
                  <> · Resets {formatDate(quota!.monthly.resetsAt)}</>
                )}
              </p>
            </>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">No monthly limit</p>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Plan</span>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold capitalize">
            {subscription?.active
              ? subscription.planName ?? subscription.plan
              : quota?.plan?.name ?? "Free"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {subscription?.active && subscription.price
              ? `${symbol}${subscription.price}/month`
              : "Pay-as-you-go"}
          </p>
        </div>
      </div>

      {/* Add Credits */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Add Credits</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Top up your balance with Razorpay ({currency})
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-border px-3 py-2">
            <span className="text-sm text-muted-foreground">{symbol}</span>
            <input
              type="number"
              value={creditAmount}
              onChange={(e) => setCreditAmount(Number(e.target.value))}
              min={minCredit}
              step={currency === "INR" ? 100 : 1}
              className="w-24 bg-transparent text-sm outline-none"
            />
          </div>
          <div className="flex gap-2">
            {presets.map((amount) => (
              <button
                key={amount}
                onClick={() => setCreditAmount(amount)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  creditAmount === amount
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:bg-muted"
                }`}
              >
                {symbol}
                {currency === "INR"
                  ? amount.toLocaleString("en-IN")
                  : amount.toLocaleString("en-US")}
              </button>
            ))}
          </div>
          <button
            onClick={handleAddCredits}
            disabled={addingCredits || creditAmount < minCredit}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            {addingCredits ? "Processing..." : "Add Credits"}
          </button>
        </div>
      </div>

      {/* Subscription Plans */}
      {!subscription?.active && (
        <div className="mb-8">
          <h2 className="mb-4 font-semibold">Subscription Plans</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {dbPlans.map((plan) => {
              const priceSmallest = plan.prices[currency] ?? plan.prices.USD ?? 0;
              const priceDisplay = priceSmallest / 100;
              return (
                <div
                  key={plan.id}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="mt-2">
                    <span className="text-3xl font-bold">
                      {symbol}
                      {currency === "INR"
                        ? priceDisplay.toLocaleString("en-IN")
                        : priceDisplay.toLocaleString("en-US")}
                    </span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-0.5 text-foreground">·</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() =>
                      handleSubscribe(plan.id as "starter" | "pro" | "team")
                    }
                    className="mt-5 w-full rounded-lg border border-border py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    Subscribe
                  </button>
                </div>
              );
            })}
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <AlertCircle className="h-3 w-3" />
            Plans are billed monthly via Razorpay. Cancel anytime. Prices shown in {currency}.
          </p>
        </div>
      )}

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
            {payments.map((p) => {
              const pSymbol =
                CURRENCIES.find((c) => c.id === p.currency)?.symbol ?? "$";
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between px-5 py-3"
                >
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
                      {p.type === "onboarding"
                        ? "OB"
                        : p.type === "credits"
                          ? "CR"
                          : p.type === "subscription"
                            ? "SB"
                            : "RF"}
                    </div>
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {p.type === "onboarding"
                          ? "Onboarding Credits"
                          : p.type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(p.timeCreated)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {pSymbol}
                      {p.currency === "INR"
                        ? p.amount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : p.amount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                    </p>
                    <p
                      className={`text-xs capitalize ${
                        p.status === "captured"
                          ? "text-green-500"
                          : p.status === "failed"
                            ? "text-red-500"
                            : "text-muted-foreground"
                      }`}
                    >
                      {p.status}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
