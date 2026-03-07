import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { Navbar } from "@/components/navbar";
import Link from "next/link";

export const metadata: Metadata = generatePageMetadata({
  title: "Terms of Service",
  description:
    "Terms of Service for Creor — the AI-native code editor. Read our terms governing the use of our platform and services.",
  path: "/terms",
});

export default function TermsOfService() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-sm text-neutral-400">
            Last updated: March 7, 2026
          </p>

          <div className="mt-12 space-y-10 text-neutral-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using Creor (&quot;the Service&quot;), operated
                by Creor (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;),
                you agree to be bound by these Terms of Service. If you do not
                agree, do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                2. Description of Service
              </h2>
              <p>
                Creor is an AI-powered code editor and development platform that
                provides intelligent coding assistance, multi-provider LLM
                integrations, terminal-based workflows, and related developer
                tools. The Service is available as a desktop application, web
                application, and CLI tool.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                3. Accounts and Registration
              </h2>
              <p>
                To access certain features, you must create an account. You are
                responsible for maintaining the confidentiality of your account
                credentials and for all activities under your account. You must
                provide accurate and complete information during registration and
                promptly update it if it changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                4. Subscriptions and Payments
              </h2>
              <p>
                Some features require a paid subscription. By subscribing, you
                authorize us to charge your payment method on a recurring basis
                at the applicable rate. All fees are non-refundable unless
                otherwise stated. We reserve the right to change pricing with 30
                days&apos; notice. You may cancel your subscription at any time;
                cancellation takes effect at the end of the current billing
                period.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                5. Acceptable Use
              </h2>
              <p>You agree not to:</p>
              <ul className="mt-2 list-disc list-inside space-y-1 text-neutral-400">
                <li>
                  Use the Service for any unlawful purpose or to violate any
                  laws
                </li>
                <li>
                  Reverse engineer, decompile, or attempt to extract the source
                  code of proprietary components
                </li>
                <li>
                  Interfere with or disrupt the Service or its infrastructure
                </li>
                <li>
                  Attempt to gain unauthorized access to other users&apos;
                  accounts or data
                </li>
                <li>
                  Use the Service to transmit malware, viruses, or harmful code
                </li>
                <li>
                  Resell or redistribute the Service without written permission
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                6. Intellectual Property
              </h2>
              <p>
                You retain all rights to the code and content you create using
                Creor. The Creor name, logo, and branding are our trademarks.
                Open-source components of Creor are licensed under their
                respective licenses. AI-generated suggestions provided by the
                Service are offered as-is and you are responsible for reviewing
                and using them appropriately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                7. Privacy and Data
              </h2>
              <p>
                Your use of the Service is also governed by our{" "}
                <Link
                  href="/privacy"
                  className="text-white underline underline-offset-4 hover:text-neutral-300"
                >
                  Privacy Policy
                </Link>
                . By using the Service, you consent to the collection and use of
                information as described therein.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                8. Disclaimer of Warranties
              </h2>
              <p>
                The Service is provided &quot;as is&quot; and &quot;as
                available&quot; without warranties of any kind, express or
                implied. We do not guarantee that the Service will be
                uninterrupted, error-free, or that AI-generated outputs will be
                accurate, complete, or suitable for any purpose.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                9. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by law, Creor shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages, including loss of profits, data, or goodwill,
                arising from your use of the Service. Our total liability shall
                not exceed the amount you paid us in the 12 months preceding the
                claim.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                10. Termination
              </h2>
              <p>
                We may suspend or terminate your access to the Service at any
                time for violation of these Terms or for any reason with
                reasonable notice. Upon termination, your right to use the
                Service ceases immediately. Provisions that by their nature
                should survive termination will remain in effect.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                11. Changes to Terms
              </h2>
              <p>
                We may update these Terms from time to time. We will notify you
                of material changes by posting the updated Terms on our website
                or through the Service. Continued use of the Service after
                changes constitutes acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                12. Contact
              </h2>
              <p>
                If you have questions about these Terms, contact us at{" "}
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
        </div>
      </main>
    </>
  );
}
