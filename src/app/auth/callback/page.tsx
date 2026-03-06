"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
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
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <div className="h-5 w-5 mx-auto animate-spin rounded-full border-2 border-border border-t-foreground" />
        <p className="text-sm text-foreground-secondary">Signing you in...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
