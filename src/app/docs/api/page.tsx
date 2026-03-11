import type { Metadata } from "next";
import { Copy, MessageSquare, HelpCircle } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "API Overview | Creor",
  description: "Creor provides multiple APIs for programmatic access to your team's data, AI-powered coding agents, and analytics.",
  path: "/docs/api",
});

export default function ApiDocsPage() {
  return (
    <div className="flex w-full justify-center px-4 md:px-8 py-10 lg:py-16">
      <div className="flex w-full max-w-[1100px] justify-between gap-12 xl:gap-24">
        {/* Article Content */}
        <article className="min-w-0 max-w-[760px] flex-1">
          <p className="mb-3 text-[13px] text-[#A1A1A1]">API</p>
          <h1 className="mb-6 text-[32px] font-semibold tracking-tight text-[#EDEDED] sm:text-[40px]">
            Creor APIs Overview
          </h1>
          <p className="mb-10 text-[15px] leading-relaxed text-[#D1D1D1] sm:text-[16px]">
            Creor provides multiple APIs for programmatic access to your team&apos;s data, AI-powered coding agents, and analytics.
          </p>

          {/* Available APIs Section */}
          <h2 className="mb-5 mt-12 text-[20px] font-semibold tracking-tight text-[#EDEDED]">
            Available APIs
          </h2>
          
          <div className="mb-12 overflow-hidden rounded-lg border border-[#222222] bg-[#141414]">
            <table className="w-full text-left text-[14px]">
              <thead className="border-b border-[#222222] bg-[#1A1A1A] text-[12px] font-medium text-[#A1A1A1]">
                <tr>
                  <th className="px-4 py-3 font-medium">API</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                <tr>
                  <td className="px-4 py-4 text-[#EDEDED] underline decoration-[#333333] underline-offset-4 cursor-pointer hover:decoration-[#A1A1A1]">Admin API</td>
                  <td className="px-4 py-4 text-[#A1A1A1]">Manage team members, settings, usage data, and spending. Build custom dashboards and monitoring tools.</td>
                  <td className="px-4 py-4 text-[#A1A1A1]">Enterprise teams</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-[#EDEDED] underline decoration-[#333333] underline-offset-4 cursor-pointer hover:decoration-[#A1A1A1]">Analytics API</td>
                  <td className="px-4 py-4 text-[#A1A1A1]">Comprehensive insights into team&apos;s Creor usage, AI metrics, active users, and model usage.</td>
                  <td className="px-4 py-4 text-[#A1A1A1]">Enterprise teams</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-[#EDEDED] underline decoration-[#333333] underline-offset-4 cursor-pointer hover:decoration-[#A1A1A1]">AI Code Tracking API</td>
                  <td className="px-4 py-4 text-[#A1A1A1]">Track AI-generated code contributions at commit and change levels for attribution and analytics.</td>
                  <td className="px-4 py-4 text-[#A1A1A1]">Enterprise teams</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-[#EDEDED] underline decoration-[#333333] underline-offset-4 cursor-pointer hover:decoration-[#A1A1A1]">Cloud Agents API</td>
                  <td className="px-4 py-4 text-[#A1A1A1]">Programmatically create and manage AI-powered coding agents for automated workflows and code generation.</td>
                  <td className="px-4 py-4 text-[#A1A1A1]">Beta (All Plans)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="h-px w-full bg-[#222222] my-10" />

          {/* Authentication Section */}
          <h2 className="mb-5 text-[20px] font-semibold tracking-tight text-[#EDEDED]">
            Authentication
          </h2>
          <p className="mb-8 text-[15px] leading-relaxed text-[#D1D1D1]">
            All Creor APIs use Basic Authentication.
          </p>

          <h3 className="mb-4 text-[16px] font-medium tracking-tight text-[#EDEDED]">
            Basic Authentication
          </h3>
          <p className="mb-4 text-[15px] leading-relaxed text-[#D1D1D1]">
            Use your API key as the username in basic authentication (leave password empty):
          </p>

          <div className="mb-6 overflow-hidden rounded-md border border-[#222222] bg-[#0A0A0A]">
            <div className="flex px-4 py-3 font-mono text-[13px]">
              <div className="mr-4 select-none flex-col text-right text-[#444444]">
                <span>1</span><br/><span>2</span>
              </div>
              <div className="flex-col text-[#EDEDED]">
                <span className="text-[#A1A1A1]">curl</span> <span className="text-[#3399FF]">https://api.creor.ai/teams/members</span> \
                <br/>
                <span className="text-[#A1A1A1] ml-4">-u</span> YOUR_API_KEY:
              </div>
            </div>
          </div>

          <p className="mb-4 text-[15px] leading-relaxed text-[#D1D1D1]">
            Or set the Authorization header directly:
          </p>

          <div className="mb-10 overflow-hidden rounded-md border border-[#222222] bg-[#0A0A0A]">
            <div className="px-4 py-4 font-mono text-[13px] text-[#EDEDED]">
              Authorization: <span className="text-[#3399FF]">Basic</span> {`{base64_encode('YOUR_API_KEY:')}`}
            </div>
          </div>
        </article>

        {/* Right Sidebar */}
        <aside className="hidden w-[220px] shrink-0 xl:block">
          <div className="sticky top-[92px] space-y-8">
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
