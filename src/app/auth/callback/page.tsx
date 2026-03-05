"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Suspense } from "react";

function CallbackContent() {
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const code = searchParams.get("code");
    const provider = searchParams.get("provider");

    if (!code || !provider) {
      setError("Missing authentication parameters");
      return;
    }

    (async () => {
      try {
        let result;
        if (provider === "github") {
          result = await api.authGithub(code);
        } else if (provider === "google") {
          const redirectUri = `${window.location.origin}/auth/callback?provider=google`;
          result = await api.authGoogle(code, redirectUri);
        } else {
          setError("Unknown provider");
          return;
        }
        await login(result.token);
        // Hard redirect to avoid race conditions with React re-renders
        window.location.href = "/dashboard";
      } catch (err: unknown) {
        // If already logged in (token exists), just redirect
        if (typeof window !== "undefined" && localStorage.getItem("creor_token")) {
          window.location.href = "/dashboard";
          return;
        }
        setError(
          err instanceof Error ? err.message : "Authentication failed"
        );
      }
    })();
  }, [searchParams, login]);

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
