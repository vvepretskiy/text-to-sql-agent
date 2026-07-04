import { describe, expect, it } from "vitest";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getRenderableMessages } from "./chat-view-model";

describe("getRenderableMessages", () => {
  it("filters non-renderable messages and maps role/content", () => {
    const human = new HumanMessage("hello");
    const ai = new AIMessage("world");

    const result = getRenderableMessages([
      new SystemMessage("sys"),
      human,
      ai,
    ]);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ role: "human", content: "hello" });
    expect(result[1]).toMatchObject({ role: "ai", content: "world" });
  });

  it("builds deterministic keys based on type and index", () => {
    const result = getRenderableMessages([
      new HumanMessage("q1"),
      new AIMessage("a1"),
      new HumanMessage("q2"),
    ]);

    expect(result.map((item) => item.key)).toEqual([
      "human-0",
      "ai-1",
      "human-2",
    ]);
  });
});
