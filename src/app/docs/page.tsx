import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Copy, MessageSquare, HelpCircle, Rocket, FileText, Blocks } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Documentation | Creor",
  description: "Guides, API reference, and tutorials for Creor.",
  path: "/docs",
});

export default function DocsPage() {
  return (
    <div className="flex w-full justify-center px-4 md:px-8 py-10 lg:py-16">
      <div className="flex w-full max-w-[1100px] justify-between gap-12 xl:gap-24">
        {/* Article Content */}
        <article className="min-w-0 max-w-[760px] flex-1">
          <p className="mb-3 text-[13px] text-[#A1A1A1]">Get Started</p>
          <h1 className="mb-6 text-[32px] font-semibold tracking-tight text-[#EDEDED] sm:text-[40px]">
            Creor Documentation
          </h1>
          <p className="mb-10 text-[15px] leading-relaxed text-[#D1D1D1] sm:text-[16px]">
            Creor is an AI editor and coding agent. Use it to understand your codebase, plan and build features, fix bugs, review changes, and work with the tools you already use.
          </p>

          {/* Hero Image Block */}
          <div className="mb-16 overflow-hidden rounded-xl bg-[#0a0a09]">
            <Image
              src="https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=2688&auto=format&fit=crop"
              alt="Creor Editor UI"
              width={1600}
              height={900}
              className="w-full h-auto object-cover opacity-80 mix-blend-lighten"
              unoptimized
            />
          </div>

          {/* Start Here Section */}
          <h2 className="mb-5 text-xl font-semibold tracking-tight text-[#EDEDED]">
            Start here
          </h2>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <Link href="/docs/quickstart" className="flex flex-col rounded-lg border border-[#222222] bg-[#141414] p-5 transition-colors hover:bg-[#1A1A1A]">
              <div className="mb-3 flex items-center gap-2">
                <Rocket className="h-4 w-4 text-[#A1A1A1]" />
                <h3 className="text-[14px] font-medium text-[#EDEDED]">Get started</h3>
              </div>
              <p className="text-[13px] leading-relaxed text-[#A1A1A1]">
                Go from install to your first useful change in Creor
              </p>
            </Link>

            {/* Card 2 */}
            <Link href="/docs/models" className="flex flex-col rounded-lg border border-[#222222] bg-[#141414] p-5 transition-colors hover:bg-[#1A1A1A]">
              <div className="mb-3 flex items-center gap-2">
                <Blocks className="h-4 w-4 text-[#A1A1A1]" />
                <h3 className="text-[14px] font-medium text-[#EDEDED]">Models & Pricing</h3>
              </div>
              <p className="text-[13px] leading-relaxed text-[#A1A1A1]">
                Compare models, usage pools, and plan pricing
              </p>
            </Link>

            {/* Card 3 */}
            <Link href="/docs/changelog" className="flex flex-col rounded-lg border border-[#222222] bg-[#141414] p-5 transition-colors hover:bg-[#1A1A1A]">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#A1A1A1]" />
                <h3 className="text-[14px] font-medium text-[#EDEDED]">Changelog</h3>
              </div>
              <p className="text-[13px] leading-relaxed text-[#A1A1A1]">
                Stay up to date with the latest features and improvements
              </p>
            </Link>
          </div>
        </article>

        {/* Right Sidebar */}
        <aside className="hidden w-[220px] shrink-0 xl:block">
          <div className="sticky top-[92px] space-y-8">
            <div>
              <h4 className="mb-3 text-[13px] font-medium text-[#EDEDED]">Start here</h4>
              <div className="flex flex-col space-y-2 text-[13px]">
                <Link href="#what-you-can-do" className="text-[#A1A1A1] transition-colors hover:text-[#EDEDED]">
                  What you can do with Creor
                </Link>
                <Link href="#models" className="text-[#A1A1A1] transition-colors hover:text-[#EDEDED]">
                  Models
                </Link>
                <Link href="#more-resources" className="text-[#A1A1A1] transition-colors hover:text-[#EDEDED]">
                  More resources
                </Link>
              </div>
            </div>

            <div className="h-px w-full bg-[#222222]" />

            <div className="flex flex-col space-y-3.5 text-[13px]">
              <button className="flex items-center gap-2.5 text-[#A1A1A1] transition-colors hover:text-[#EDEDED]">
                <Copy className="h-4 w-4" />
                Copy page
              </button>
              <button className="flex items-center gap-2.5 text-[#A1A1A1] transition-colors hover:text-[#EDEDED]">
                <MessageSquare className="h-4 w-4" />
                Share feedback
              </button>
              <button className="flex items-center gap-2.5 text-[#A1A1A1] transition-colors hover:text-[#EDEDED]">
                <HelpCircle className="h-4 w-4" />
                Explain more
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
