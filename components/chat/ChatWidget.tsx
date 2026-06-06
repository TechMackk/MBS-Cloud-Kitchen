"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const ChatPanel = dynamic(
  () =>
    import("@/components/chat/ChatPanel").then((mod) => mod.ChatPanel),
  { ssr: false },
);

const PULSE_KEY = "mbs-chat-pulse-shown";

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(PULSE_KEY)) {
      return;
    }

    setPulse(true);
    sessionStorage.setItem(PULSE_KEY, "1");
    const timeout = window.setTimeout(() => setPulse(false), 3000);
    return () => window.clearTimeout(timeout);
  }, []);

  const handleClose = useCallback(() => setOpen(false), []);
  const handleMinimize = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-orange text-white shadow-lg transition-transform hover:scale-105 hover:bg-orange-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-neon",
          pulse && "animate-pulse shadow-glow-card",
          open && "hidden md:flex",
        )}
        aria-label="Open MBS Assistant chat"
      >
        <MessageCircle className="h-6 w-6" aria-hidden="true" />
      </button>

      <ChatPanel open={open} onClose={handleClose} onMinimize={handleMinimize} />
    </>
  );
}
