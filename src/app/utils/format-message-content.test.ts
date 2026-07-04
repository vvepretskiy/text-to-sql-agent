import { describe, expect, it } from "vitest";
import { formatMessageContent } from "./format-message-content";

describe("formatMessageContent", () => {
  it("returns plain string content", () => {
    expect(formatMessageContent("hello")).toBe("hello");
  });

  it("joins array content with text parts", () => {
    const content = [
      "part-1",
      { type: "text", text: "part-2" },
      { type: "image", url: "https://example.com" },
    ] as const;

    expect(formatMessageContent(content as never)).toBe("part-1 part-2");
  });

  it("falls back to string conversion for non-array, non-string content", () => {
    expect(formatMessageContent(42 as never)).toBe("42");
  });
});
