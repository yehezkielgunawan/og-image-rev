import { describe, expect, it } from "vitest";
import { parseCardInput } from "./params";

const input = {
  occasion: "birthday", template: "minimal", theme: "warm", size: "square",
  heading: "Happy birthday!", recipient: "", message: "Have a lovely day.", sender: "",
};

describe("card validation", () => {
  it("normalizes text and preserves message line breaks and empty names", () => {
    expect(parseCardInput({ ...input, message: "  Hello\r\nWorld  " })).toEqual({
      ok: true, value: { ...input, message: "Hello\nWorld" },
    });
  });

  it.each([null, [], "hello", 42])("rejects non-object input %j", (value) => {
    expect(parseCardInput(value).ok).toBe(false);
  });

  it.each(["occasion", "template", "theme", "size"])("rejects unknown %s", (field) => {
    expect(parseCardInput({ ...input, [field]: "unknown" })).toMatchObject({ ok: false, field });
  });

  it.each(["heading", "message"])("requires %s", (field) => {
    expect(parseCardInput({ ...input, [field]: "  " })).toMatchObject({ ok: false, field });
  });

  it.each([["heading", 80], ["message", 400], ["recipient", 60], ["sender", 60]])(
    "enforces %s length", (field, limit) => {
      expect(parseCardInput({ ...input, [field]: "x".repeat(Number(limit) + 1) })).toMatchObject({ ok: false, field });
      expect(parseCardInput({ ...input, [field]: "x".repeat(Number(limit)) }).ok).toBe(true);
    },
  );

  it("rejects non-string and missing fields without coercing them", () => {
    expect(parseCardInput({ ...input, sender: 12 })).toMatchObject({ ok: false, field: "sender" });
    const { message, ...incomplete } = input;
    expect(parseCardInput(incomplete)).toMatchObject({ ok: false, field: "message" });
  });

  it("bounds explicit message lines and rejects inherited option names", () => {
    expect(parseCardInput({ ...input, message: Array(13).fill("hello").join("\n") })).toMatchObject({ ok: false, field: "message" });
    expect(parseCardInput({ ...input, message: Array(12).fill("hello").join("\n") }).ok).toBe(true);
    expect(parseCardInput({ ...input, template: "toString" })).toMatchObject({ ok: false, field: "template" });
  });
});
