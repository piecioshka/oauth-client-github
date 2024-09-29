import { describe, it, expect, vi } from "vitest";
import { buildUrl, makePostRequest } from "./helpers";

describe("buildUrl", () => {
  it("should build a url with params", () => {
    const uri = "https://example.com";
    const params = { foo: "bar", baz: "qux" };
    const expected = "https://example.com?foo=bar&baz=qux";
    expect(buildUrl(uri, params)).toEqual(expected);
  });
});

describe("makePostRequest", () => {
  it("should make a POST request", async () => {
    const url = "https://example.com";
    const params = { foo: "bar" };
    const expected = { success: true };
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(expected),
    });
    global.fetch = fetchMock;
    const result = await makePostRequest(url, params);
    expect(result).toEqual(expected);
    expect(fetchMock).toHaveBeenCalledWith(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
  });
});
