"use client";

import { useEffect, useRef, useCallback } from "react";
import { createClient, type RealtimeChannel, type SupabaseClient } from "@supabase/supabase-js";
import { api } from "@/lib/api";

/**
 * Subscribes to Supabase Realtime changes on the mcp_installations table.
 * Calls `onUpdate` whenever installations change (e.g., from IDE or another session),
 * so the UI can refetch fresh data immediately instead of requiring a page reload.
 */
export function useMarketplaceRealtime(onUpdate: () => void) {
  const clientRef = useRef<SupabaseClient | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const setup = useCallback(async () => {
    try {
      const config = await api.getMarketplaceRealtimeConfig();

      if (!clientRef.current) {
        clientRef.current = createClient(config.supabaseUrl, config.anonKey, {
          realtime: { params: { eventsPerSecond: 2 } },
          auth: { persistSession: false },
        });
      }

      if (channelRef.current) {
        clientRef.current.removeChannel(channelRef.current);
      }

      const channel = clientRef.current
        .channel(`mcp:${config.workspaceId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: config.table,
            filter: `workspace_id=eq.${config.workspaceId}`,
          },
          () => onUpdate()
        )
        .subscribe((status) => {
          // Catch-up fetch when channel connects/reconnects to pick up any missed events
          if (status === "SUBSCRIBED") {
            onUpdate();
          }
        });

      channelRef.current = channel;
    } catch {
      console.warn("Marketplace Realtime not available, using manual refresh");
    }
  }, [onUpdate]);

  useEffect(() => {
    setup();

    return () => {
      if (channelRef.current && clientRef.current) {
        clientRef.current.removeChannel(channelRef.current);
      }
    };
  }, [setup]);
}
