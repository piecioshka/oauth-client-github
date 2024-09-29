import { describe, it, expect, beforeEach, vi } from "vitest";
import { init, OAuthClientGitHub } from "./index";
import * as helpers from "./helpers";

describe("buildTemporaryTokenUrl", () => {
  let githubAuth: OAuthClientGitHub;

  beforeEach(() => {
    githubAuth = init({
      client_id: "fake-client_id",
      client_secret: "fake-client_secret",
      redirect_uri: "fake-redirect_uri",
      scope: "fake-scope",
    });
  });

  it("should return and class instance of OAuthClientGitHub", () => {
    expect(githubAuth).toBeInstanceOf(OAuthClientGitHub);
  });

  it("should build URL for temporary token (without state)", () => {
    expect(githubAuth.buildTemporaryTokenUrl()).toEqual(
      "https://github.com/login/oauth/authorize?client_id=fake-client_id&redirect_uri=fake-redirect_uri&scope=fake-scope"
    );
    expect(githubAuth.buildTemporaryTokenUrl({})).toEqual(
      "https://github.com/login/oauth/authorize?client_id=fake-client_id&redirect_uri=fake-redirect_uri&scope=fake-scope"
    );
  });

  it("should build URL for temporary token (with state)", () => {
    expect(githubAuth.buildTemporaryTokenUrl({ state: "/list" })).toEqual(
      "https://github.com/login/oauth/authorize?client_id=fake-client_id&redirect_uri=fake-redirect_uri&scope=fake-scope&state=%2Flist"
    );
    expect(githubAuth.buildTemporaryTokenUrl({ state: "" })).toEqual(
      "https://github.com/login/oauth/authorize?client_id=fake-client_id&redirect_uri=fake-redirect_uri&scope=fake-scope"
    );
    expect(githubAuth.buildTemporaryTokenUrl({ state: undefined })).toEqual(
      "https://github.com/login/oauth/authorize?client_id=fake-client_id&redirect_uri=fake-redirect_uri&scope=fake-scope"
    );
  });
});

describe("requestAccessToken", () => {
  let githubAuth: OAuthClientGitHub;

  beforeEach(() => {
    githubAuth = init({
      client_id: "fake-client_id",
      client_secret: "fake-client_secret",
      redirect_uri: "fake-redirect_uri",
      scope: "fake-scope",
    });
  });

  it("should throw an error if code is missing", async () => {
    await expect(githubAuth.requestAccessToken({ code: "" })).rejects.toThrow(
      "Missing code"
    );
    await expect(
      githubAuth.requestAccessToken({ code: undefined })
    ).rejects.toThrow("Missing code");
  });

  it("should make a POST request to get access token", async () => {
    const code = "fake-code";
    const makePostRequestSpy = vi
      .spyOn(helpers, "makePostRequest")
      .mockResolvedValueOnce({});

    await githubAuth.requestAccessToken({ code });

    expect(makePostRequestSpy).toHaveBeenCalled();
  });
});
