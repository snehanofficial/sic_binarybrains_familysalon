"use client";

import { SuggestionChip } from "../../../types/chatbot";

interface SuggestedQuestionsProps {
  onSelectQuestion: (query: string) => void;
}

const suggestions: SuggestionChip[] = [
  { text: "Recommend a haircut", icon: "✨", query: "Can you recommend a haircut style for me?" },
  { text: "Beard style suggestions", icon: "💇", query: "What are some good beard style suggestions?" },
  { text: "Hair color ideas", icon: "🎨", query: "What are some trending hair color ideas?" },
  { text: "Hair care routine", icon: "🌿", query: "Could you suggest a daily hair care routine?" },
  { text: "Bridal consultation", icon: "💄", query: "What bridal styling packages do you offer?" },
  { text: "Skin care advice", icon: "✨", query: "What skin care advice or facial do you suggest?" },
  { text: "Kids haircut", icon: "👶", query: "Do you have options for kids haircuts?" },
  { text: "What service should I book?", icon: "📅", query: "How do I know what service I should book?" },
];

export default function SuggestedQuestions({ onSelectQuestion }: SuggestedQuestionsProps) {
  return (
    <div className="p-3 bg-white/70 border-t border-[#F0EDE9] flex flex-col gap-1.5 select-none">
      <span className="text-[10px] text-[#6B7280] font-semibold uppercase tracking-wider pl-1" style={{ fontFamily: "Inter, sans-serif" }}>
        Suggested Prompts
      </span>
      <div className="flex flex-row gap-2 overflow-x-auto py-1 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {suggestions.map((chip, i) => (
          <button
            key={i}
            onClick={() => onSelectQuestion(chip.query)}
            className="flex items-center gap-1.5 text-xs bg-[#F7F5F2] hover:bg-[#EEF5F1] hover:text-[#5F8D6D] border border-black/[0.05] text-[#2B2B2B] px-3.5 py-2 rounded-full transition-all duration-200 font-medium cursor-pointer flex-shrink-0 hover:-translate-y-[1px] hover:shadow-sm"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <span className="text-sm">{chip.icon}</span>
            <span>{chip.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
