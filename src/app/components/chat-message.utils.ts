import type { BaseMessage } from "@langchain/core/messages";

export function formatMessageContent(content: BaseMessage["content"]) {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }

        if (part && typeof part === "object" && "text" in part) {
          return String(part.text);
        }

        return "";
      })
      .join(" ")
      .trim();
  }

  return String(content);
}