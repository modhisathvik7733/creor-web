"use client";

import { useEffect, useRef, useCallback } from "react";
import { createClient, type RealtimeChannel, type SupabaseClient } from "@supabase/supabase-js";
import { api } from "@/lib/api";

/**
 * Subscribes to Supabase Realtime changes on billing/subscriptions tables.
 * Calls `onUpdate` whenever the workspace's billing state changes,
 * so the UI can refetch fresh data immediately instead of polling.
 */
export function useBillingRealtime(onUpdate: () => void) {
  const clientRef = useRef<SupabaseClient | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const setup = useCallback(async () => {
    try {
      const config = await api.getBillingRealtimeConfig();

      // Create a dedicated Supabase client for Realtime only
      if (!clientRef.current) {
        clientRef.current = createClient(config.supabaseUrl, config.anonKey, {
          realtime: { params: { eventsPerSecond: 2 } },
          auth: { persistSession: false },
        });
      }

      // Clean up existing channel if any
      if (channelRef.current) {
        clientRef.current.removeChannel(channelRef.current);
      }

      // Subscribe to billing + subscriptions changes for this workspace
      const channel = clientRef.current
        .channel(`billing:${config.workspaceId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "billing",
            filter: `workspace_id=eq.${config.workspaceId}`,
          },
          () => onUpdate()
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "subscriptions",
            filter: `workspace_id=eq.${config.workspaceId}`,
          },
          () => onUpdate()
        )
        .subscribe();

      channelRef.current = channel;
    } catch {
      // Realtime not available — fall back to manual refresh
      console.warn("Billing Realtime not available, using manual refresh");
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
