export function TypingIndicator() {
  return (
    <div
      className="flex items-center gap-1 px-4 py-3"
      aria-live="polite"
      aria-label="Assistant is typing"
    >
      <span className="h-2 w-2 animate-bounce rounded-full bg-green-soft [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-green-soft [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-green-soft" />
    </div>
  );
}
