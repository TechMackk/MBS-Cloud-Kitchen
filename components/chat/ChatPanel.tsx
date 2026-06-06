"use client";

import { useChat } from "@ai-sdk/react";
import { track } from "@vercel/analytics";
import { Minus, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { ChatInput } from "@/components/chat/ChatInput";
import { MessageList } from "@/components/chat/MessageList";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getSessionId(): string {
  const key = "mbs-chat-session-id";
  const existing = sessionStorage.getItem(key);
  if (existing) {
    return existing;
  }

  const id = crypto.randomUUID();
  sessionStorage.setItem(key, id);
  return id;
}

export interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

export function ChatPanel({ open, onClose, onMinimize }: ChatPanelProps) {
  const [sessionId] = useState(getSessionId);
  const [input, setInput] = useState("");
  const [hasTrackedSession, setHasTrackedSession] = useState(false);

  const chatBody = useMemo(() => ({ sessionId }), [sessionId]);

  const {
    messages,
    append,
    status,
    error,
    reload,
  } = useChat({
    api: "/api/chat",
    body: chatBody,
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) {
      return;
    }

    setInput("");
    if (!hasTrackedSession) {
      track("chat_session_started");
      setHasTrackedSession(true);
    }
    await append({ role: "user", content: trimmed });
  }, [append, hasTrackedSession, input, isLoading]);

  const handleSuggestedQuestion = useCallback(
    async (question: string) => {
      if (isLoading) return;
      if (!hasTrackedSession) {
        track("chat_session_started");
        setHasTrackedSession(true);
      }
      await append({ role: "user", content: question });
    },
    [append, hasTrackedSession, isLoading],
  );

  if (!open) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col bg-bg shadow-2xl",
        "inset-0 md:inset-auto md:bottom-24 md:right-6 md:h-[600px] md:w-[400px] md:rounded-2xl md:border md:border-green-soft/20",
      )}
      role="dialog"
      aria-label="MBS Assistant chat"
    >
      <header className="flex items-center justify-between border-b border-green-soft/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-xs" />
          <div>
            <p className="font-heading text-sm font-semibold text-green-deep">
              MBS Assistant
            </p>
            <p className="text-[10px] text-text/50">Telangana cuisine expert</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMinimize}
            className="rounded-lg p-1.5 text-text/60 hover:bg-cream md:inline-flex"
            aria-label="Minimize chat"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text/60 hover:bg-cream"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {error && (
        <div className="border-b border-orange/20 bg-orange/5 px-4 py-3 text-sm text-orange">
          <p>
            I&apos;m having trouble right now. Please try again or WhatsApp us.
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2 h-auto p-0 text-orange hover:text-orange-neon"
            onClick={() => reload()}
          >
            Retry
          </Button>
        </div>
      )}

      <MessageList
        messages={messages}
        isLoading={isLoading}
        onSuggestedQuestion={handleSuggestedQuestion}
      />

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        disabled={isLoading}
      />
    </div>
  );
}
