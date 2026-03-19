"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
interface Session {
  id: string;
  title: string | null;
}

interface SessionTabsProps {
  sessions: Session[];
  openTabIds: string[];
  activeSessionId: string | null;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onCloseOthers: (id: string) => void;
  onCloseToRight: (id: string) => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
  onNewChat: () => void;
}

interface ContextMenu {
  tabId: string;
  x: number;
  y: number;
}

function cleanTitle(session: Session): string {
  const t = session.title;
  if (!t || /^SESSION\s*-/i.test(t)) return "New Chat";
  return t;
}

export function SessionTabs({
  sessions,
  openTabIds,
  activeSessionId,
  onSelect,
  onClose,
  onCloseOthers,
  onCloseToRight,
  onRename,
  onDelete,
  onNewChat,
}: SessionTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);

  // Scroll active tab into view when it changes
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, [activeSessionId]);

  // Close context menu on click outside or Escape
  useEffect(() => {
    if (!contextMenu) return;
    const handleClick = () => setContextMenu(null);
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setContextMenu(null); };
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [contextMenu]);

  const sessionMap = new Map(sessions.map((s) => [s.id, s]));
  const visibleTabs = openTabIds.filter((id) => sessionMap.has(id));

  const handleClose = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      onClose(id);
    },
    [onClose],
  );

  const handleContextMenu = useCallback((e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ tabId, x: e.clientX, y: e.clientY });
  }, []);

  const menuAction = useCallback(
    (action: (id: string) => void) => {
      if (contextMenu) {
        action(contextMenu.tabId);
        setContextMenu(null);
      }
    },
    [contextMenu],
  );

  const contextTabIdx = contextMenu ? visibleTabs.indexOf(contextMenu.tabId) : -1;
  const hasTabsToRight = contextTabIdx >= 0 && contextTabIdx < visibleTabs.length - 1;

  return (
    <>
      <div className="flex min-w-0 items-center gap-0.5">
        <div
          ref={scrollRef}
          className="flex min-w-0 items-center gap-0.5 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {visibleTabs.map((id) => {
            const session = sessionMap.get(id);
            if (!session) return null;
            const isActive = id === activeSessionId;
            return (
              <button
                key={id}
                ref={isActive ? activeRef : undefined}
                onClick={() => onSelect(id)}
                onContextMenu={(e) => handleContextMenu(e, id)}
                className={cn(
                  "group flex max-w-[180px] shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                <span className="truncate">{cleanTitle(session)}</span>
                <span
                  role="button"
                  tabIndex={-1}
                  onClick={(e) => handleClose(e, id)}
                  className={cn(
                    "ml-0.5 shrink-0 rounded p-0.5 transition-colors hover:bg-foreground/10",
                    isActive ? "opacity-60 hover:opacity-100" : "opacity-0 group-hover:opacity-60 hover:!opacity-100",
                  )}
                >
                  <X className="h-3 w-3" />
                </span>
              </button>
            );
          })}
        </div>
        <button
          onClick={onNewChat}
          className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="New chat"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          className="fixed z-50 min-w-[180px] overflow-hidden rounded-lg border border-border bg-card shadow-xl"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => menuAction(onClose)}
            className="flex w-full items-center px-3 py-2 text-[13px] text-foreground transition-colors hover:bg-muted"
          >
            Close Tab
          </button>
          <button
            onClick={() => menuAction(onCloseOthers)}
            disabled={visibleTabs.length <= 1}
            className="flex w-full items-center px-3 py-2 text-[13px] text-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
          >
            Close Other Tabs
          </button>
          <button
            onClick={() => menuAction(onCloseToRight)}
            disabled={!hasTabsToRight}
            className="flex w-full items-center px-3 py-2 text-[13px] text-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
          >
            Close Tabs to the Right
          </button>
          <div className="my-1 border-t border-border" />
          <button
            onClick={() => menuAction(onRename)}
            className="flex w-full items-center px-3 py-2 text-[13px] text-foreground transition-colors hover:bg-muted"
          >
            Rename
          </button>
          <button
            onClick={() => menuAction(onDelete)}
            className="flex w-full items-center px-3 py-2 text-[13px] text-red-500 transition-colors hover:bg-red-500/10"
          >
            Delete Session
          </button>
        </div>
      )}
    </>
  );
}
