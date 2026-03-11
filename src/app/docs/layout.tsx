"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Search, ChevronRight } from "lucide-react";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isApi = pathname.startsWith("/docs/api");

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#EDEDED] font-sans selection:bg-[#FF6A13] selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex h-[52px] items-center justify-between border-b border-[#222222] bg-[#0E0E0E]/95 px-4 backdrop-blur-md">
        <div className="flex h-full items-center gap-6">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#EDEDED]"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            <span className="text-[15px] font-semibold tracking-tight">Creor</span>
          </Link>
          <nav className="hidden h-full items-center gap-1 md:flex">
            <Link
              href="/docs"
              className={cn(
                "relative flex h-full items-center px-4 text-[13px] transition-colors hover:text-[#EDEDED]",
                !isApi ? "font-medium text-[#FF6A13]" : "text-[#A1A1A1]"
              )}
            >
              Docs
              {!isApi && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#FF6A13]" />}
            </Link>
            <Link
              href="/docs/api"
              className={cn(
                "relative flex h-full items-center px-4 text-[13px] transition-colors hover:text-[#EDEDED]",
                isApi ? "font-medium text-[#FF6A13]" : "text-[#A1A1A1]"
              )}
            >
              API
              {isApi && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#FF6A13]" />}
            </Link>
            <Link
              href="/learn"
              className="flex h-full items-center px-4 text-[13px] text-[#A1A1A1] transition-colors hover:text-[#EDEDED]"
            >
              Learn
            </Link>
            <Link
              href="/help"
              className="flex h-full items-center px-4 text-[13px] text-[#A1A1A1] transition-colors hover:text-[#EDEDED]"
            >
              Help
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex h-8 items-center gap-2 rounded-md border border-[#333333] bg-[#141414] px-3 text-[13px] text-[#A1A1A1] transition-colors hover:bg-[#1A1A1A] hover:text-[#EDEDED]">
            <Search className="h-3.5 w-3.5" />
            <span className="w-40 text-left">Search docs...</span>
            <span className="flex items-center gap-0.5 rounded-sm bg-[#222222] px-1.5 py-0.5 text-[10px] uppercase font-mono">
              <span className="text-[11px]">⌘</span>K
            </span>
          </button>

          <Link
            href="/dashboard"
            className="flex h-8 items-center rounded-md border border-[#333333] bg-[#1A1A1A] px-4 text-[13px] font-medium text-[#EDEDED] transition-colors hover:bg-[#222222]"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <div className="flex mx-auto w-full">
        {/* Left Sidebar */}
        <aside className="sticky top-[52px] hidden h-[calc(100vh-52px)] w-[260px] shrink-0 overflow-y-auto border-r border-[#222222] py-8 pl-6 pr-4 md:block">
          {isApi ? (
            <div className="space-y-8">
              <div>
                <h4 className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wider text-[#A1A1A1]">
                  API Overview
                </h4>
                <div className="flex flex-col space-y-0.5 text-[14px]">
                  <Link href="/docs/api" className="rounded-md px-2 py-1.5 font-medium text-[#FF6A13] transition-colors">
                    Overview
                  </Link>
                  {["Authentication", "Rate Limits", "Best Practices"].map((item) => (
                    <Link key={item} href={`/docs/api/${item.toLowerCase().replace(' ', '-')}`} className="rounded-md px-2 py-1.5 text-[#A1A1A1] hover:bg-[#1A1A1A] hover:text-[#EDEDED] transition-colors">
                      {item}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wider text-[#A1A1A1]">
                  Cloud Agents API
                </h4>
                <div className="flex flex-col space-y-0.5 text-[14px]">
                  {["Overview", "List Agents", "Agent Status", "Agent Conversation", "List Artifacts", "Download Artifact", "Launch Agent", "Add Follow-up", "Stop Agent", "Delete Agent", "API Key Info", "List Models", "List Repositories", "Webhooks"].map((item) => (
                    <Link key={item} href={`/docs/api/cloud-agents/${item.toLowerCase().replace(/ /g, '-')}`} className="rounded-md px-2 py-1.5 text-[#A1A1A1] hover:bg-[#1A1A1A] hover:text-[#EDEDED] transition-colors">
                      {item}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wider text-[#A1A1A1]">
                  Admin API
                </h4>
                <div className="flex flex-col space-y-0.5 text-[14px]">
                  {["Overview", "Team Members", "Audit Logs", "Get Daily Usage Data", "Spending Data", "Get Usage Events Data", "User Spend Limit"].map((item) => (
                    <Link key={item} href={`/docs/api/admin/${item.toLowerCase().replace(/ /g, '-')}`} className="rounded-md px-2 py-1.5 text-[#A1A1A1] hover:bg-[#1A1A1A] hover:text-[#EDEDED] transition-colors">
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <h4 className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wider text-[#A1A1A1]">
                  Get Started
                </h4>
                <div className="flex flex-col space-y-0.5 text-[14px]">
                  <Link href="/docs" className="rounded-md px-2 py-1.5 font-medium text-[#FF6A13] transition-colors">
                    Welcome
                  </Link>
                  <Link href="/docs/quickstart" className="rounded-md px-2 py-1.5 text-[#A1A1A1] hover:bg-[#1A1A1A] hover:text-[#EDEDED] transition-colors">
                    Quickstart
                  </Link>
                  <div className="flex items-center justify-between group rounded-md px-2 py-1.5 text-[#A1A1A1] hover:bg-[#1A1A1A] hover:text-[#EDEDED] transition-colors cursor-pointer">
                    <span>Models & Pricing</span>
                    <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <Link href="/docs/changelog" className="rounded-md px-2 py-1.5 text-[#A1A1A1] hover:bg-[#1A1A1A] hover:text-[#EDEDED] transition-colors">
                    Changelog
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wider text-[#A1A1A1]">
                  Agent
                </h4>
                <div className="flex flex-col space-y-0.5 text-[14px]">
                  {["Overview", "Planning", "Prompting", "Debugging"].map((item) => (
                    <Link key={item} href={`/docs/${item.toLowerCase()}`} className="rounded-md px-2 py-1.5 text-[#A1A1A1] hover:bg-[#1A1A1A] hover:text-[#EDEDED] transition-colors flex items-center justify-between group">
                      <span>{item}</span>
                    </Link>
                  ))}

                  <div className="flex items-center justify-between group rounded-md px-2 py-1.5 text-[#A1A1A1] hover:bg-[#1A1A1A] hover:text-[#EDEDED] transition-colors cursor-pointer">
                    <span>Tools</span>
                    <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>

                  {["Parallel Agents", "Security"].map((item) => (
                    <Link key={item} href={`/docs/${item.toLowerCase().replace(' ', '-')}`} className="rounded-md px-2 py-1.5 text-[#A1A1A1] hover:bg-[#1A1A1A] hover:text-[#EDEDED] transition-colors flex items-center justify-between group">
                      <span>{item}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wider text-[#A1A1A1]">
                  Customizing
                </h4>
                <div className="flex flex-col space-y-0.5 text-[14px]">
                  {["Plugins", "Rules", "Skills", "Subagents", "Hooks", "MCP"].map((item) => (
                    <Link key={item} href={`/docs/${item.toLowerCase()}`} className="rounded-md px-2 py-1.5 text-[#A1A1A1] hover:bg-[#1A1A1A] hover:text-[#EDEDED] transition-colors">
                      {item}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wider text-[#A1A1A1]">
                  Cloud Agents
                </h4>
                <div className="flex flex-col space-y-0.5 text-[14px]">
                  {["Overview", "Setup", "Capabilities", "Bugbot", "Best Practices", "Security & Network", "Settings"].map((item) => (
                    <Link key={item} href={`/docs/${item.toLowerCase().replace(' & ', '-').replace(' ', '-')}`} className="rounded-md px-2 py-1.5 text-[#A1A1A1] hover:bg-[#1A1A1A] hover:text-[#EDEDED] transition-colors">
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
