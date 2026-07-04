import { memo, useMemo } from "react";
import type { BaseMessage } from "@langchain/core/messages";
import { formatMessageContent } from "../utils/format-message-content";

type ChatMessageProps = {
  role: "human" | "ai";
  content: BaseMessage["content"];
};

function ChatMessageBase({ role, content }: ChatMessageProps) {
  const formattedContent = useMemo(() => formatMessageContent(content), [content]);

  if (role === "human") {
    return (
      <article className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-cyan-500 px-4 py-3 text-sm text-slate-950 shadow-lg shadow-cyan-500/20">
          {formattedContent}
        </div>
      </article>
    );
  }

  return (
    <article className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 shadow-lg shadow-black/10">
        {formattedContent}
      </div>
    </article>
  );
}

export const ChatMessage = memo(ChatMessageBase);