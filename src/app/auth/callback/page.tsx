"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { GridBackground } from "@/components/grid-background";
import { Suspense } from "react";

function CallbackContent() {
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const calledRef = useRef(false);

  const code = useMemo(() => searchParams.get("code"), [searchParams]);
  const provider = useMemo(() => searchParams.get("provider"), [searchParams]);
  const stateRedirect = useMemo(() => {
    const s = searchParams.get("state");
    return s ? decodeURIComponent(s) : "/dashboard";
  }, [searchParams]);

  useEffect(() => {
    if (calledRef.current) return;

    if (!code || !provider) return;

    calledRef.current = true;

    (async () => {
      try {
        let result;
        if (provider === "github") {
          const redirectUri = `${window.location.origin}/auth/callback?provider=github`;
          result = await api.authGithub(code, redirectUri);
        } else if (provider === "google") {
          const redirectUri = `${window.location.origin}/auth/callback?provider=google`;
          result = await api.authGoogle(code, redirectUri);
        } else {
          setError("Unknown provider");
          return;
        }
        await login(result.token);
        // Hard redirect to avoid race conditions with React re-renders
        window.location.href = stateRedirect;
      } catch (err: unknown) {
        // If already logged in (token exists), just redirect
        if (typeof window !== "undefined" && localStorage.getItem("creor_token")) {
          window.location.href = stateRedirect;
          return;
        }
        setError(
          err instanceof Error ? err.message : "Authentication failed"
        );
      }
    })();
  }, [searchParams, login, code, provider, stateRedirect]);

  if (!code || !provider) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <p className="text-sm text-red-500">Missing authentication parameters</p>
          <a
            href="/login"
            className="text-sm text-foreground-secondary underline hover:text-foreground"
          >
            Try again
          </a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <p className="text-sm text-red-500">{error}</p>
          <a
            href="/login"
            className="text-sm text-foreground-secondary underline hover:text-foreground"
          >
            Try again
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4 overflow-hidden">
      <GridBackground />
      <div className="relative z-10 flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl border border-white/5 bg-white/[0.02] shadow-[0_0_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />
        
        <div className="relative mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-zinc-800 to-zinc-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_20px_rgba(0,0,0,0.5)]">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>

        <div className="mb-6 relative flex h-12 w-12 items-center justify-center">
          <div className="absolute h-full w-full animate-[spin_3s_linear_infinite] rounded-full border border-white/10" />
          <div className="absolute h-full w-full animate-[spin_1.5s_ease-in-out_infinite] rounded-full border-2 border-transparent border-t-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
        </div>

        <h2 className="text-lg font-semibold tracking-tight text-white/90">Authenticating</h2>
        <p className="mt-2 text-sm text-white/50 text-center max-w-[200px] leading-relaxed">
          Please wait while we securely log you in to Creor.
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="relative flex min-h-screen items-center justify-center bg-background p-4 overflow-hidden">
          <GridBackground />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
