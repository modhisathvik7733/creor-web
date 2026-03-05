"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  CreditCard,
  Plus,
  IndianRupee,
  Zap,
  AlertCircle,
} from "lucide-react";

interface BillingInfo {
  balance: number;
  monthlyLimit: number | null;
  monthlyUsage: number;
  reloadEnabled: boolean;
  reloadAmount: number;
  reloadTrigger: number;
  hasSubscription: boolean;
}

interface Subscription {
  active: boolean;
  plan?: string;
  price?: number;
}

const PLANS = [
  {
    id: "starter" as const,
    name: "Starter",
    price: 499,
    features: [
      "5,000 AI requests/month",
      "All models",
      "1 workspace member",
      "Community support",
    ],
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: 1999,
    features: [
      "50,000 AI requests/month",
      "All models + priority",
      "5 workspace members",
      "Priority support",
    ],
  },
  {
    id: "team" as const,
    name: "Team",
    price: 4999,
    features: [
      "Unlimited AI requests",
      "All models + priority",
      "Unlimited members",
      "Dedicated support",
    ],
  },
];

function formatINR(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

export default function BillingPage() {
  const [billing, setBilling] = useState<BillingInfo | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingCredits, setAddingCredits] = useState(false);
  const [creditAmount, setCreditAmount] = useState(500);

  useEffect(() => {
    Promise.all([api.getBilling(), api.getSubscription()])
      .then(([b, s]) => {
        setBilling(b);
        setSubscription(s);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAddCredits = async () => {
    setAddingCredits(true);
    try {
      const order = await api.addCredits(creditAmount * 100);
      // In production, this would open Razorpay checkout
      alert(`Razorpay order created: ${order.orderId}. Amount: ₹${creditAmount}`);
    } catch {
      alert("Failed to create order");
    } finally {
      setAddingCredits(false);
    }
  };

  const handleSubscribe = async (plan: "starter" | "pro" | "team") => {
    try {
      const result = await api.subscribe(plan);
      if (result.shortUrl) {
        window.location.href = result.shortUrl;
      }
    } catch {
      alert("Failed to create subscription");
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
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your credits and subscription
        </p>
      </div>

      {/* Balance & Usage */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Balance</span>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">
            {billing ? formatINR(billing.balance) : "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Available credits</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Monthly Usage</span>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">
            {billing ? formatINR(billing.monthlyUsage) : "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {billing?.monthlyLimit
              ? `Limit: ${formatINR(billing.monthlyLimit)}`
              : "No monthly limit set"}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Plan</span>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold capitalize">
            {subscription?.active ? subscription.plan : "Free"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {subscription?.active
              ? `₹${subscription.price}/month`
              : "Pay-as-you-go"}
          </p>
        </div>
      </div>

      {/* Add Credits */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Add Credits</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Top up your balance with Razorpay
        </p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-border px-3 py-2">
            <span className="text-sm text-muted-foreground">₹</span>
            <input
              type="number"
              value={creditAmount}
              onChange={(e) => setCreditAmount(Number(e.target.value))}
              min={100}
              step={100}
              className="w-24 bg-transparent text-sm outline-none"
            />
          </div>
          <div className="flex gap-2">
            {[500, 1000, 2500, 5000].map((amount) => (
              <button
                key={amount}
                onClick={() => setCreditAmount(amount)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  creditAmount === amount
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:bg-muted"
                }`}
              >
                ₹{amount.toLocaleString("en-IN")}
              </button>
            ))}
          </div>
          <button
            onClick={handleAddCredits}
            disabled={addingCredits || creditAmount < 100}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            {addingCredits ? "Processing..." : "Add Credits"}
          </button>
        </div>
      </div>

      {/* Plans */}
      {!subscription?.active && (
        <div>
          <h2 className="mb-4 font-semibold">Subscription Plans</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className="rounded-xl border border-border bg-card p-5"
              >
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="mt-2">
                  <span className="text-3xl font-bold">
                    ₹{plan.price.toLocaleString("en-IN")}
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
                  onClick={() => handleSubscribe(plan.id)}
                  className="mt-5 w-full rounded-lg border border-border py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Subscribe
                </button>
              </div>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <AlertCircle className="h-3 w-3" />
            Plans are billed monthly via Razorpay. Cancel anytime.
          </p>
        </div>
      )}
    </div>
  );
}
