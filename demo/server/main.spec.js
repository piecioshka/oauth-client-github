const { describe, it, expect } = require("vitest");
const { buildRedirectPath } = require("./main.js");

describe("buildRedirectPath", () => {
  it("falls back to the app root for empty or invalid state values", () => {
    expect(buildRedirectPath()).toBe("/");
    expect(buildRedirectPath(undefined)).toBe("/");
    expect(buildRedirectPath("")).toBe("/");
    expect(buildRedirectPath("   ")).toBe("/");
  });

  it("keeps a same-origin relative path with query parameters and hash", () => {
    expect(buildRedirectPath("/dashboard?tab=users#profile")).toBe(
      "/dashboard?tab=users#profile"
    );
    expect(buildRedirectPath("/list?sort=asc#top")).toBe(
      "/list?sort=asc#top"
    );
  });

  it("rejects external URLs and protocol-relative payloads", () => {
    expect(buildRedirectPath("https://evil.example/path")).toBe("/");
    expect(buildRedirectPath("//evil.example/path")).toBe("/");
    expect(buildRedirectPath("/\\evil.example/path")).toBe("/");
    expect(buildRedirectPath("javascript:alert(1)")).toBe("/");
  });

  it("rejects malformed or non-path values", () => {
    expect(buildRedirectPath("https:evil.example/path")).toBe("/");
    expect(buildRedirectPath("mailto:test@example.com")).toBe("/");
    expect(buildRedirectPath("http://localhost/path")).toBe("/");
    expect(buildRedirectPath("not a path")).toBe("/");
  });
});
