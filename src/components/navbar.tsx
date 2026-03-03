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
  Github,
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
        label: "Docs",
        href: "/docs",
        description: "Guides and API reference",
        icon: BookOpen,
      },
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
      <div className="animate-dropdown w-[300px] rounded-lg border border-border bg-background/95 p-1.5 shadow-[0_8px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="group flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-muted"
          >
            <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
            <div className="min-w-0">
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
    <div className="fixed inset-0 z-40 bg-background md:hidden">
      <div className="flex h-full flex-col overflow-y-auto px-6 pb-8 pt-16">
        {navItems.map((item) => (
          <div key={item.label} className="border-b border-border py-4">
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
            href="/dashboard"
            onClick={onClose}
            className="block w-full rounded-md bg-accent py-2.5 text-center text-[13px] font-medium text-accent-foreground"
          >
            Download
          </Link>
          <Link
            href="/docs"
            onClick={onClose}
            className="block w-full rounded-md border border-border py-2.5 text-center text-[13px] font-medium text-foreground"
          >
            Documentation
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
          "fixed top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "border-b border-border bg-background/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-14 max-w-[1080px] items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <svg
              width="18"
              height="18"
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
            <span className="text-[14px] font-semibold tracking-[-0.02em]">
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
                        "flex items-center gap-1 rounded-md px-3 py-1.5 text-[13px] transition-colors text-foreground-secondary hover:text-foreground",
                        openDropdown === item.label && "text-foreground"
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-3 w-3 transition-transform duration-200",
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
                  className="rounded-md px-3 py-1.5 text-[13px] text-foreground-secondary transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right */}
          <div className="hidden items-center gap-2 md:flex">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md p-2 text-foreground-secondary transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <div className="mx-1 h-4 w-px bg-border" />
            <Link
              href="/docs"
              className="rounded-md px-3 py-1.5 text-[13px] text-foreground-secondary transition-colors hover:text-foreground"
            >
              Docs
            </Link>
            <Link
              href="/dashboard"
              className="rounded-md bg-accent px-4 py-1.5 text-[13px] font-medium text-accent-foreground transition-opacity hover:opacity-80"
            >
              Download
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
