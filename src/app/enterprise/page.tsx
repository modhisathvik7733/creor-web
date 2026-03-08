import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Building2, Check, ArrowRight } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Enterprise",
  description:
    "Creor for teams that need more. Custom deployments, priority support, and enterprise-grade security.",
  path: "/enterprise",
});

const FEATURES = [
  {
    title: "Single Sign-On (SSO)",
    desc: "SAML and OIDC support for your existing identity provider. Centralized access management for your entire engineering team.",
  },
  {
    title: "Custom Deployments",
    desc: "Self-hosted or private cloud deployments. Keep your code and AI interactions within your own infrastructure.",
  },
  {
    title: "Dedicated Support",
    desc: "Priority support with a dedicated account manager. Custom onboarding, training, and integration assistance.",
  },
  {
    title: "SLA & Compliance",
    desc: "Guaranteed uptime SLAs, SOC 2 compliance, and audit logging. Built for teams with strict security requirements.",
  },
];

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-[720px] px-6 pt-32 pb-20">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
          <Building2 className="h-5 w-5 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight">Enterprise</h1>
        <p className="mt-4 text-lg text-foreground-secondary">
          Creor for teams that need more. Custom deployments, priority support,
          and enterprise-grade security.
        </p>

        <div className="mt-12 space-y-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex gap-3">
              <Check className="mt-1 h-4 w-4 flex-shrink-0 text-foreground" />
              <div>
                <p className="font-medium">{f.title}</p>
                <p className="mt-0.5 text-sm text-foreground-secondary">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="mailto:enterprise@creor.dev"
          className="group mt-12 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Contact Sales
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </main>
    </div>
  );
}
