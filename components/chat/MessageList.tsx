"use client";

import { useEffect, useRef } from "react";

import { ChatBubble } from "@/components/chat/ChatBubble";
import { SuggestedQuestions } from "@/components/chat/SuggestedQuestions";
import { TypingIndicator } from "@/components/chat/TypingIndicator";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system" | "data";
  content: string;
};

export interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSuggestedQuestion: (question: string) => void;
}

export function MessageList({
  messages,
  isLoading,
  onSuggestedQuestion,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const visibleMessages = messages.filter(
    (msg) => msg.role === "user" || msg.role === "assistant",
  );

  return (
    <div
      className="flex-1 overflow-y-auto"
      aria-live="polite"
      aria-label="Chat messages"
    >
      {visibleMessages.length === 0 && !isLoading ? (
        <SuggestedQuestions
          onSelect={onSuggestedQuestion}
          disabled={isLoading}
        />
      ) : (
        <div className="space-y-4 p-4">
          {visibleMessages.map((message) => (
            <ChatBubble
              key={message.id}
              role={message.role as "user" | "assistant"}
              content={message.content}
            />
          ))}
          {isLoading && <TypingIndicator />}
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
