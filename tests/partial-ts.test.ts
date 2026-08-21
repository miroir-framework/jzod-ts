import { describe, expect, it } from "vitest";

import { jzodToZodTextAndTsTypeText } from "../src/JzodToTs";

function normalizeTypeBody(tsTypeText: string): string {
  return tsTypeText
    .replace(/^type \w+ = /, "")
    .replace(/;\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

describe("partial TS type generation (#23/#24)", () => {
  it("host partial: all root keys optional", () => {
    const result = jzodToZodTextAndTsTypeText(
      {
        type: "object",
        partial: true,
        definition: {
          a: { type: "string" },
          b: { type: "number" },
        },
      },
      {},
      "HostPartial",
    );
    const body = normalizeTypeBody(result.tsTypeText);
    expect(body).toContain("a?:");
    expect(body).toContain("b?:");
    expect(body).not.toMatch(/\ba:\s*string/);
  });

  it("extend partial: extended keys optional, host keys required", () => {
    const result = jzodToZodTextAndTsTypeText(
      {
        type: "object",
        extend: {
          type: "object",
          partial: true,
          definition: {
            a: { type: "string" },
            b: { type: "number" },
          },
        },
        definition: {
          c: { type: "boolean" },
        },
      },
      {},
      "ExtendPartial",
    );
    const body = normalizeTypeBody(result.tsTypeText);
    expect(body).toContain("a?:");
    expect(body).toContain("b?:");
    expect(body).toMatch(/\bc:\s*boolean/);
    expect(body).not.toMatch(/\bc\?:/);
  });

  it("eager schemaReference partial: root keys optional, context type unchanged", () => {
    const result = jzodToZodTextAndTsTypeText(
      {
        type: "schemaReference",
        context: {
          o: {
            type: "object",
            definition: {
              a: { type: "string" },
              b: { type: "number" },
            },
          },
        },
        definition: { partial: true, relativePath: "o", eager: true },
      },
      {},
      "EagerPartialRef",
    );
    const mainBody = normalizeTypeBody(result.tsTypeText);
    expect(mainBody).toContain("a?:");
    expect(mainBody).toContain("b?:");

    const contextBody = normalizeTypeBody(result.contextTsTypeText.o);
    expect(contextBody).toMatch(/\ba:\s*string/);
    expect(contextBody).toMatch(/\bb:\s*number/);
    expect(contextBody).not.toContain("a?:");
  });

  it("lazy schemaReference partial: main type partial, context type unchanged", () => {
    const result = jzodToZodTextAndTsTypeText(
      {
        type: "schemaReference",
        context: {
          o: {
            type: "object",
            definition: {
              a: { type: "string" },
              b: { type: "number" },
            },
          },
        },
        definition: { partial: true, relativePath: "o" },
      },
      {},
      "LazyPartialRef",
    );
    const mainBody = normalizeTypeBody(result.tsTypeText);
    expect(mainBody === "Partial<O>" || (mainBody.includes("a?:") && mainBody.includes("b?:"))).toBe(true);
    expect(mainBody).not.toMatch(/^O$/);

    const contextBody = normalizeTypeBody(result.contextTsTypeText.o);
    expect(contextBody).toMatch(/\ba:\s*string/);
    expect(contextBody).toMatch(/\bb:\s*number/);
  });

  it("lazy schemaReference partial on non-object: TS unchanged", () => {
    const context = { s: { type: "string" as const } };
    const withPartial = jzodToZodTextAndTsTypeText(
      {
        type: "schemaReference",
        context,
        definition: { partial: true, relativePath: "s" },
      },
      {},
      "LazyPartialNonObject",
    );
    const withoutPartial = jzodToZodTextAndTsTypeText(
      {
        type: "schemaReference",
        context,
        definition: { relativePath: "s" },
      },
      {},
      "LazyNonObject",
    );
    expect(normalizeTypeBody(withPartial.tsTypeText)).toBe("S");
    expect(normalizeTypeBody(withoutPartial.tsTypeText)).toBe("S");
  });

  it("lazy schemaReference without partial: main type is context alias", () => {
    const result = jzodToZodTextAndTsTypeText(
      {
        type: "schemaReference",
        context: {
          o: {
            type: "object",
            definition: {
              a: { type: "string" },
            },
          },
        },
        definition: { relativePath: "o" },
      },
      {},
      "LazyRef",
    );
    expect(normalizeTypeBody(result.tsTypeText)).toBe("O");
  });
});
