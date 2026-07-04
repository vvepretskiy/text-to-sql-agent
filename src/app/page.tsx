"use client";

import { useCallback, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  HumanMessage,
  SystemMessage,
  BaseMessage,
  AIMessage,
  mapChatMessagesToStoredMessages,
} from "@langchain/core/messages";
import { askAgent } from "@/core/actions";
import { ChatMessage } from "@/components/chat-message";
import { getRenderableMessages } from "@/core/chat-view-model";
import { SYSTEM_PROMPT } from "@/core/constants";
import { useAutoScroll } from "@/hooks/use-auto-scroll";

export default function Home() {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<BaseMessage[]>(() => [
    new SystemMessage(SYSTEM_PROMPT),
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useAutoScroll(messages.length);
  const renderableMessages = useMemo(() => getRenderableMessages(messages), [messages]);

  const sendMessage = useCallback(async () => {
    const trimmedMessage = inputMessage.trim();

    if (!trimmedMessage || isLoading) {
      return;
    }

    setError(null);
    setIsLoading(true);
    const messageHistory = [...messages, new HumanMessage(trimmedMessage)];

    try {
      const response = await askAgent(
        mapChatMessagesToStoredMessages(messageHistory),
      );

      if (typeof response === "string" && response.length > 0) {
        messageHistory.push(new AIMessage(response));
      }

      setMessages(messageHistory);
      setInputMessage("");
    } catch {
      setError("Unable to generate a response right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, messages]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      void sendMessage();
    },
    [sendMessage]
  );

  const canSend = !isLoading && inputMessage.trim().length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/80 px-6 py-4 backdrop-blur">
        <h1 className="text-lg font-semibold tracking-tight">Text to SQL Agent</h1>
        <p className="text-sm text-slate-400">
          Ask a question in plain language and get SQL backed by the demo database.
        </p>
      </header>

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
            {renderableMessages.map((message) => (
              <ChatMessage key={message.key} role={message.role} content={message.content} />
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="border-t border-white/10 bg-slate-950/90 px-4 py-4 backdrop-blur sm:px-6">
          <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-4xl flex-col gap-3">
            <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-2xl shadow-black/20">
              <input
                type="text"
                disabled={isLoading}
                value={inputMessage}
                onChange={(event) => setInputMessage(event.target.value)}
                className="h-12 flex-1 rounded-xl border border-white/10 bg-slate-900/80 px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                placeholder="Ask a question..."
              />
              <button
                type="submit"
                disabled={!canSend}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-cyan-500 px-5 text-sm font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Loading..." : "Send"}
              </button>
            </div>
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          </form>
        </div>
      </main>
    </div>
  );
}