"use client";

import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function DeviceAuthContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get("code") ?? "";

  const [userCode, setUserCode] = useState(codeFromUrl);
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);
  const [error, setError] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      const redirect = `/auth/device${codeFromUrl ? `?code=${codeFromUrl}` : ""}`;
      router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
    }
  }, [authLoading, user, router, codeFromUrl]);

  const handleApprove = async () => {
    if (!userCode.trim()) {
      setError("Please enter the code shown in your IDE");
      return;
    }
    setApproving(true);
    setError("");
    try {
      await api.approveDevice(userCode.trim());
      setApproved(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to approve. Check the code and try again."
      );
    } finally {
      setApproving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  if (!user) return null;

  if (approved) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-sm space-y-6 px-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
            <svg
              className="h-6 w-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Device Approved</h1>
          <p className="text-sm text-foreground-secondary">
            You can close this tab and return to the Creor IDE. It will sign in automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-6 px-4">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <svg
              width="32"
              height="32"
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
          </div>
          <h1 className="text-xl font-semibold tracking-tight">
            Authorize Creor IDE
          </h1>
          <p className="mt-1.5 text-sm text-foreground-secondary">
            Enter the code shown in your IDE to grant access to your account
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="code" className="mb-1.5 block text-sm font-medium">
              Device Code
            </label>
            <input
              id="code"
              type="text"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value.toUpperCase())}
              placeholder="ABC-DEF"
              maxLength={7}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-center font-mono text-lg tracking-[0.3em] placeholder:tracking-normal placeholder:text-foreground-secondary/50 focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApprove();
              }}
            />
          </div>

          {error && (
            <p className="text-center text-sm text-red-500">{error}</p>
          )}

          <button
            onClick={handleApprove}
            disabled={approving || !userCode.trim()}
            className="w-full rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {approving ? "Approving..." : "Approve Device"}
          </button>
        </div>

        <div className="rounded-lg border border-border bg-muted/50 p-3">
          <p className="text-xs text-foreground-secondary">
            Signed in as <span className="font-medium text-foreground">{user.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DeviceAuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
        </div>
      }
    >
      <DeviceAuthContent />
    </Suspense>
  );
}
