"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Menu,
  X,
  Cpu,
  Terminal,
  Code2,
  FileSearch,
  BookOpen,
  Newspaper,
  FileText,
  ArrowRight,
} from "lucide-react";

interface DropdownItem {
  label: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavLink {
  label: string;
  href: string;
  items?: never;
}

interface NavDropdown {
  label: string;
  href?: never;
  items: DropdownItem[];
}

type NavItem = NavLink | NavDropdown;

const navItems: NavItem[] = [
  {
    label: "Product",
    items: [
      {
        label: "AI Agents",
        href: "/product/agents",
        description: "Autonomous coding agents with 19+ LLM providers",
        icon: Cpu,
      },
      {
        label: "Editor",
        href: "/product/editor",
        description: "VS Code fork with native AI built in",
        icon: Code2,
      },
      {
        label: "Terminal",
        href: "/product/terminal",
        description: "Terminal-first workflow with PTY support",
        icon: Terminal,
      },
      {
        label: "Code Search",
        href: "/product/search",
        description: "RAG-powered semantic search",
        icon: FileSearch,
      },
    ],
  },
  {
    label: "Resources",
    items: [
      {
        label: "Blog",
        href: "/blog",
        description: "Updates and announcements",
        icon: Newspaper,
      },
      {
        label: "Changelog",
        href: "/changelog",
        description: "Release history",
        icon: FileText,
      },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "Docs", href: "/docs" },
];

function Dropdown({
  items,
  isOpen,
  onClose,
}: {
  items: DropdownItem[];
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute left-1/2 top-full pt-2 -translate-x-1/2">
      <div className="animate-dropdown w-[320px] overflow-hidden rounded-xl border border-border bg-background/95 shadow-[0_12px_48px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:shadow-[0_12px_48px_rgba(0,0,0,0.6)]">
        <div className="h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        <div className="p-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="group flex items-start gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-muted"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted transition-colors group-hover:bg-foreground">
                <item.icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-background" />
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="text-[13px] font-medium text-foreground">
                  {item.label}
                </p>
                <p className="text-[11px] leading-snug text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl md:hidden">
      <div className="flex h-full flex-col overflow-y-auto px-6 pb-8 pt-20">
        {navItems.map((item) => (
          <div key={item.label} className="border-b border-white/[0.05] py-4">
            {"items" in item && item.items ? (
              <>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {item.label}
                </p>
                <div className="space-y-0.5">
                  {item.items.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={onClose}
                      className="flex items-center gap-2.5 rounded-md px-2 py-2 text-[14px] text-foreground hover:bg-muted"
                    >
                      <sub.icon className="h-3.5 w-3.5 text-muted-foreground" />
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <Link
                href={item.href!}
                onClick={onClose}
                className="block text-[14px] font-medium text-foreground"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
        <div className="mt-auto space-y-3 pt-6">
          <Link
            href="/login"
            onClick={onClose}
            className="block w-full rounded-full bg-foreground py-2.5 text-center text-[13px] font-semibold text-background transition-transform active:scale-95"
          >
            Sign in
          </Link>
          <Link
            href="/download"
            onClick={onClose}
            className="block w-full rounded-full border border-white/10 bg-white/5 py-2.5 text-center text-[13px] font-medium text-foreground transition-transform active:scale-95"
          >
            Download
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleEnter = useCallback((label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(label);
  }, []);

  const handleLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-500",
          scrolled
            ? "border-b border-white/[0.08] bg-black/60 backdrop-blur-[20px] shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
        <div className="flex h-16 items-center justify-between px-8">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-70">
              <div className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-foreground">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-black"
                >
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <span className="text-[17px] font-semibold tracking-[-0.03em]">
                Creor
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const hasDropdown = "items" in item && item.items;

                if (hasDropdown) {
                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => handleEnter(item.label)}
                      onMouseLeave={handleLeave}
                    >
                      <button
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === item.label ? null : item.label
                          )
                        }
                        className={cn(
                          "relative group flex items-center gap-1.5 rounded-md px-3.5 py-2 text-[14px] font-medium transition-all",
                          openDropdown === item.label
                            ? "text-white"
                            : "text-white/50 hover:text-white"
                        )}
                      >
                        <span>{item.label}</span>
                        <span
                          className={cn(
                            "absolute inset-x-3.5 bottom-1.5 h-px bg-white/20 transition-all origin-left",
                            openDropdown === item.label ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                          )}
                        />
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            openDropdown === item.label && "rotate-180"
                          )}
                        />
                      </button>
                      <Dropdown
                        items={item.items!}
                        isOpen={openDropdown === item.label}
                        onClose={() => setOpenDropdown(null)}
                      />
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className="relative group rounded-md px-3.5 py-2 text-[14px] font-medium text-white/50 transition-all hover:text-white"
                  >
                    <span>{item.label}</span>
                    <span className="absolute inset-x-3.5 bottom-1.5 h-px bg-white/20 scale-x-0 transition-transform origin-left group-hover:scale-x-100" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right */}
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/login"
              className="rounded-md px-5 py-2 text-[14px] font-medium text-foreground-secondary transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/download"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-foreground px-6 py-2.5 text-[14px] font-semibold text-background transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_25px_rgba(255,255,255,0.1)]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
              Download
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-1.5 text-foreground md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
