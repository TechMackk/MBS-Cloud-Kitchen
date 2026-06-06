import ReactMarkdown from "react-markdown";

import { cn } from "@/lib/utils";

export interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-green-soft/30 text-green-deep"
            : "bg-cream text-text",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
        {!isUser && (
          <p className="mt-2 text-[10px] text-text/40">Powered by AI</p>
        )}
      </div>
    </div>
  );
}
