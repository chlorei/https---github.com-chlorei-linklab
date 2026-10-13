import { describe, expect, it } from "vitest";
import { createLinkSchema, normalizeUrl, passwordChangeSchema } from "@/lib/validation";
import { safeNextPath } from "@/app/utils/safeNextPath";

describe("normalizeUrl", () => {
  it.each([
    ["example.com", "https://example.com"],
    ["  example.com/a?b=1 ", "https://example.com/a?b=1"],
    ["example.com:8080/x", "https://example.com:8080/x"],
    ["http://example.com", "http://example.com"],
    ["javascript:alert(1)", "javascript:alert(1)"],
  ])("%s -> %s", (input, expected) => {
    expect(normalizeUrl(input)).toBe(expected);
  });
});

describe("createLinkSchema", () => {
  const parse = (originalUrl: string) => createLinkSchema.safeParse({ originalUrl });

  it("accepts http(s) URLs, with or without a scheme", () => {
    expect(parse("https://example.com/path").success).toBe(true);
    expect(parse("example.com").data?.originalUrl).toBe("https://example.com");
  });

  it.each(["javascript:alert(1)", "data:text/html,hi", "ftp://example.com", "not a url", "localhost", ""])(
    "rejects %j",
    (url) => expect(parse(url).success).toBe(false)
  );

  it("rejects links to the short domain itself (redirect loop)", () => {
    const res = parse("https://rld.bio/abc123");
    expect(res.success).toBe(false);
    expect(res.error?.issues[0].message).toMatch(/already a short link/);
  });

  it("treats an empty projectId as no project", () => {
    expect(createLinkSchema.parse({ originalUrl: "example.com", projectId: "" }).projectId).toBeNull();
    expect(createLinkSchema.safeParse({ originalUrl: "example.com", projectId: "nope" }).success).toBe(false);
  });
});

describe("passwordChangeSchema", () => {
  it("requires a new password that differs and is long enough", () => {
    expect(passwordChangeSchema.safeParse({ currentPassword: "oldpassword", newPassword: "short" }).success).toBe(false);
    expect(passwordChangeSchema.safeParse({ currentPassword: "samesame1", newPassword: "samesame1" }).success).toBe(false);
    expect(passwordChangeSchema.safeParse({ currentPassword: "oldpassword", newPassword: "newpassword" }).success).toBe(true);
  });
});

describe("safeNextPath", () => {
  it.each([
    ["/projects", "/projects"],
    ["/links?q=1", "/links?q=1"],
    ["//evil.com", "/dashboard"],
    ["/\\evil.com", "/dashboard"],
    ["https://evil.com", "/dashboard"],
    [undefined, "/dashboard"],
    // browsers strip tabs/newlines, turning these into "//evil.com"
    ["/\t/evil.com", "/dashboard"],
    ["/\n/evil.com", "/dashboard"],
    ["/\r\n/evil.com", "/dashboard"],
    ["/\\/evil.com", "/dashboard"],
    ["/.//evil.com", "/dashboard"],
    ["javascript:alert(1)", "/dashboard"],
    // encoded slashes stay inside the path
    ["/%2F/evil.com", "/%2F/evil.com"],
  ])("%j -> %j", (input, expected) => {
    expect(safeNextPath(input)).toBe(expected);
  });

  it("never yields a value a browser would resolve to another origin", () => {
    const tricky = ["/\t/x.com", "/\x0b/x.com", "/ /x.com", "/.//x.com", "/\u3000/x.com", "/%09/x.com", "///x.com"];
    for (const v of tricky) {
      expect(new URL(safeNextPath(v), "https://rld.bio").origin).toBe("https://rld.bio");
    }
  });
});
