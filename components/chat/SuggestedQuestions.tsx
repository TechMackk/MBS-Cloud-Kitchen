const SUGGESTED_QUESTIONS = [
  "What's your most popular biryani?",
  "Do you have egg-free options?",
  "How do you prepare your food?",
  "Can you cater for 100 people?",
] as const;

export interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export function SuggestedQuestions({
  onSelect,
  disabled = false,
}: SuggestedQuestionsProps) {
  return (
    <div className="space-y-3 px-4 py-6">
      <p className="text-center text-sm text-text/60">
        Ask me about our menu, catering, or quality standards.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {SUGGESTED_QUESTIONS.map((question) => (
          <button
            key={question}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(question)}
            className="rounded-full border border-green-soft/30 bg-bg px-3 py-1.5 text-xs font-medium text-green-deep transition-colors hover:border-green-soft hover:bg-cream disabled:opacity-50"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
