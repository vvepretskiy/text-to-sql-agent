import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";

export type RenderableMessage = {
  key: string;
  role: "human" | "ai";
  content: BaseMessage["content"];
};

export function getRenderableMessages(messages: BaseMessage[]): RenderableMessage[] {
  return messages
    .filter((message) => message instanceof HumanMessage || message instanceof AIMessage)
    .map((message, index) => ({
      role: message instanceof HumanMessage ? ("human" as const) : ("ai" as const),
      content: message.content,
      key: `${message.getType()}-${index}`,
    }));
}