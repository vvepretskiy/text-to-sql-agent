"use server";

import { ChatOllama } from "@langchain/ollama";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import type { StoredMessage, StoredMessageData } from "@langchain/core/messages";
import { mapStoredMessagesToChatMessages } from "@langchain/core/messages";
import { execute } from "./database";
import { SYSTEM_PROMPT, customerTable, orderTable } from "./constants";

type SqlParams = {
  sql: string;
};

export async function askAgent(messages: StoredMessage[]) {
  const model = process.env.OLLAMA_MODEL?.trim();

  if (!model) {
    return "Model is not defined. Set OLLAMA_MODEL in your environment.";
  }

  const dbTool = tool(
    async (input: SqlParams) => {
      if (!input.sql) {
        return null;
      }

      const result = await execute(input.sql);
      return JSON.stringify(result);
    },
    {
      name: "get_from_db",
      description: `Get data from a database with the following schema:\n\n${orderTable}\n${customerTable}`,
      schema: z.object({
        sql: z.string().describe(
          "SQL query to get data from the database. Always put quotes around field and table names."
        ),
      }),
    }
  );

  const systemMessageData: StoredMessageData = {
    content: SYSTEM_PROMPT,
    role: "system",
    name: "sql_assistant",
    tool_call_id: undefined,
  };

  const messageHistory: StoredMessage[] = [
    {
      type: "system",
      data: systemMessageData,
    },
    ...messages,
  ];

  const agent = createReactAgent({
    llm: new ChatOllama({
      model,
      temperature: 0,
      baseUrl: process.env.OLLAMA_BASE_URL,
    }),
    tools: [dbTool],
  });

  const response = await agent.invoke({
    messages: mapStoredMessagesToChatMessages(messageHistory),
  });

  return response.messages[response.messages.length - 1].content;
}