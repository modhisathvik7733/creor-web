import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Pricing",
  description:
    "Simple, transparent pricing for Creor. Use free with your own API keys or subscribe to Creor Gateway for one key, all models.",
  path: "/pricing",
});

const PLANS = [
  {
    name: "Free",
    price: 0,
    desc: "For individuals getting started",
    features: [
      "Bring your own API keys",
      "All LLM providers supported",
      "Unlimited local AI sessions",
      "Community support",
    ],
    cta: "Download Creor",
    href: "/download",
    highlighted: false,
  },
  {
    name: "Pro",
    price: 23.99,
    desc: "For serious developers",
    features: [
      "Everything in Free",
      "50,000 Creor Gateway requests/month",
      "All models via single API key",
      "Priority model access",
      "5 workspace members",
      "Priority support",
    ],
    cta: "Start Pro",
    href: "/login",
    highlighted: true,
  },
  {
    name: "Team",
    price: 59.99,
    desc: "For teams shipping fast",
    features: [
      "Everything in Pro",
      "Unlimited Gateway requests",
      "Unlimited workspace members",
      "Admin & role management",
      "Usage analytics dashboard",
      "Dedicated support",
    ],
    cta: "Start Team",
    href: "/login",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Nav */}
      <header className="flex h-14 items-center justify-between border-b border-border px-6">
        <Link href="/" className="flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <span className="text-sm font-semibold">Creor</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/download"
            className="text-sm text-foreground-secondary hover:text-foreground"
          >
            Download
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
          >
            Sign In
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-lg text-foreground-secondary">
          Use Creor free with your own API keys, or subscribe for the Creor
          Gateway — one key, all models.
        </p>
      </div>

      {/* Plans */}
      <div className="mx-auto grid max-w-5xl gap-6 px-6 pb-20 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-6 ${
              plan.highlighted
                ? "border-foreground bg-card shadow-sm"
                : "border-border bg-card"
            }`}
          >
            <h2 className="text-lg font-semibold">{plan.name}</h2>
            <p className="mt-1 text-sm text-foreground-secondary">{plan.desc}</p>
            <p className="mt-4">
              {plan.price === 0 ? (
                <span className="text-4xl font-bold">Free</span>
              ) : (
                <>
                  <span className="text-4xl font-bold">
                    ${plan.price.toFixed(2)}
                  </span>
                  <span className="text-foreground-secondary">/month</span>
                </>
              )}
            </p>

            <Link
              href={plan.href}
              className={`mt-6 block w-full rounded-lg py-2.5 text-center text-sm font-medium transition-colors ${
                plan.highlighted
                  ? "bg-foreground text-background hover:opacity-90"
                  : "border border-border hover:bg-muted"
              }`}
            >
              {plan.cta}
            </Link>

            <ul className="mt-6 space-y-2.5">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-sm text-foreground-secondary"
                >
                  <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-foreground" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-foreground-secondary">
        All prices in USD. Billed monthly. Cancel anytime.
      </footer>
    </div>
  );
}
