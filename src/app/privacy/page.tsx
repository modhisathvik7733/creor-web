import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { Navbar } from "@/components/navbar";
import Link from "next/link";

export const metadata: Metadata = generatePageMetadata({
  title: "Privacy Policy",
  description:
    "Privacy Policy for Creor — the AI-native code editor. Learn how we collect, use, and protect your data.",
  path: "/privacy",
});

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-neutral-400">
            Last updated: March 7, 2026
          </p>

          <div className="mt-12 space-y-10 text-neutral-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                1. Introduction
              </h2>
              <p>
                Creor (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
                respects your privacy. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                use the Creor platform, including our desktop application, web
                application, and CLI tool.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                2. Information We Collect
              </h2>
              <p className="font-medium text-white mb-2">
                Information you provide:
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutral-400">
                <li>
                  Account information (name, email address) when you register
                </li>
                <li>Payment information when you subscribe to a paid plan</li>
                <li>
                  Feedback, support requests, and communications you send us
                </li>
              </ul>
              <p className="font-medium text-white mt-4 mb-2">
                Information collected automatically:
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutral-400">
                <li>
                  Usage data (features used, session duration, error logs)
                </li>
                <li>
                  Device information (operating system, browser type, screen
                  resolution)
                </li>
                <li>IP address and approximate location</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                3. Your Code and Data
              </h2>
              <p>
                Creor processes your code locally on your device. When you use
                AI-powered features, code snippets may be sent to third-party
                LLM providers (such as Anthropic, OpenAI, or Google) to generate
                responses. We do not store your code on our servers. Each LLM
                provider&apos;s handling of your data is governed by their own
                privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                4. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-1 text-neutral-400">
                <li>To provide, maintain, and improve the Service</li>
                <li>To process payments and manage subscriptions</li>
                <li>
                  To send important notices (security alerts, policy changes)
                </li>
                <li>
                  To analyze usage patterns and improve user experience
                </li>
                <li>To respond to support requests</li>
                <li>To detect and prevent fraud or abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                5. Information Sharing
              </h2>
              <p>We do not sell your personal information. We may share data with:</p>
              <ul className="mt-2 list-disc list-inside space-y-1 text-neutral-400">
                <li>
                  <span className="text-neutral-300">Payment processors</span>{" "}
                  — to handle billing and subscriptions
                </li>
                <li>
                  <span className="text-neutral-300">LLM providers</span> — to
                  deliver AI-powered features (only when you use them)
                </li>
                <li>
                  <span className="text-neutral-300">Analytics services</span>{" "}
                  — to understand usage patterns (anonymized where possible)
                </li>
                <li>
                  <span className="text-neutral-300">Law enforcement</span> —
                  when required by law or to protect our rights
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                6. Data Security
              </h2>
              <p>
                We implement industry-standard security measures to protect your
                information, including encryption in transit (TLS) and at rest.
                However, no method of transmission over the internet is 100%
                secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                7. Data Retention
              </h2>
              <p>
                We retain your account information for as long as your account
                is active. Usage data is retained in anonymized form for
                analytics purposes. You may request deletion of your account and
                associated data at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                8. Your Rights
              </h2>
              <p>Depending on your jurisdiction, you may have the right to:</p>
              <ul className="mt-2 list-disc list-inside space-y-1 text-neutral-400">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to or restrict processing of your data</li>
                <li>Export your data in a portable format</li>
              </ul>
              <p className="mt-2">
                To exercise these rights, contact us at{" "}
                <a
                  href="mailto:support@creor.ai"
                  className="text-white underline underline-offset-4 hover:text-neutral-300"
                >
                  support@creor.ai
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                9. Cookies
              </h2>
              <p>
                We use essential cookies to maintain your session and
                preferences. We may use analytics cookies to understand how you
                use the Service. You can control cookie settings through your
                browser.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                10. Children&apos;s Privacy
              </h2>
              <p>
                The Service is not intended for children under 13. We do not
                knowingly collect personal information from children under 13. If
                you believe we have collected such information, please contact us
                immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                11. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of material changes by posting the updated policy on
                our website. Continued use of the Service after changes
                constitutes acceptance of the revised policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                12. Contact
              </h2>
              <p>
                If you have questions about this Privacy Policy, contact us at{" "}
                <a
                  href="mailto:support@creor.ai"
                  className="text-white underline underline-offset-4 hover:text-neutral-300"
                >
                  support@creor.ai
                </a>
                .
              </p>
            </section>
          </div>

          <div className="mt-16 border-t border-neutral-800 pt-8">
            <p className="text-sm text-neutral-500">
              See also our{" "}
              <Link
                href="/terms"
                className="text-neutral-400 underline underline-offset-4 hover:text-white"
              >
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
