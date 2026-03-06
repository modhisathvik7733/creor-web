"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { MessageSquare, User, Bot, ArrowLeft } from "lucide-react";

type ShareItem =
  | { type: "session"; data: { id: string; title: string; time: { created: number } } }
  | { type: "message"; data: { id: string; role: string; content?: { type: string; text?: string }[]; text?: string } }
  | { type: "part"; data: { id: string; type: string; content?: string; text?: string } }
  | { type: "session_diff"; data: unknown[] }
  | { type: "model"; data: { id: string; name: string }[] };

interface DisplayMessage {
  role: "user" | "assistant";
  content: string;
}

function extractMessages(items: ShareItem[]): { title: string; messages: DisplayMessage[] } {
  let title = "Shared Session";
  const messages: DisplayMessage[] = [];

  for (const item of items) {
    if (item.type === "session" && item.data?.title) {
      title = item.data.title;
    }
    if (item.type === "message") {
      const msg = item.data;
      let text = "";
      if (msg.content && Array.isArray(msg.content)) {
        text = msg.content
          .filter((c: { type: string; text?: string }) => c.type === "text")
          .map((c: { type: string; text?: string }) => c.text ?? "")
          .join("\n");
      } else if (typeof msg.text === "string") {
        text = msg.text;
      }
      if (text && (msg.role === "user" || msg.role === "assistant")) {
        messages.push({ role: msg.role, content: text });
      }
    }
    if (item.type === "part") {
      const part = item.data;
      if (part.type === "text" && (part.content || part.text)) {
        messages.push({ role: "assistant", content: part.content ?? part.text ?? "" });
      }
    }
  }

  return { title, messages };
}

export default function ShareByIdPage() {
  const params = useParams();
  const id = params.id as string;
  const [title, setTitle] = useState("Shared Session");
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .getShare(id)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0 && (data[0] as Record<string, unknown>)?.type) {
          // New format: typed objects from engine
          const result = extractMessages(data as ShareItem[]);
          setTitle(result.title);
          setMessages(result.messages);
        } else if (Array.isArray(data)) {
          // Legacy format: simple { role, content } array
          setMessages(data as DisplayMessage[]);
        }
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load session")
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <p className="text-sm text-foreground-secondary">{error}</p>
          <Link href="/" className="text-sm underline hover:text-foreground">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link href="/" className="rounded-lg p-1.5 transition-colors hover:bg-muted">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{title}</span>
          </div>
        </div>
        <Link
          href="/download"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
        >
          Try Creor
        </Link>
      </header>

      <div className="mx-auto max-w-3xl space-y-4 px-6 py-8">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
          >
            {msg.role === "assistant" && (
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                <Bot className="h-3.5 w-3.5" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-accent text-accent-foreground"
                  : "bg-card border border-border"
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
            </div>
            {msg.role === "user" && (
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent">
                <User className="h-3.5 w-3.5 text-accent-foreground" />
              </div>
            )}
          </div>
        ))}

        {messages.length === 0 && (
          <div className="py-20 text-center text-sm text-muted-foreground">
            This session is empty.
          </div>
        )}
      </div>
    </div>
  );
}
