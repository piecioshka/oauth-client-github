import { buildUrl, makePostRequest } from "./helpers";

const AUTH_URL = "https://github.com/login/oauth/authorize";
const ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";

interface Settings {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  scope: string;
}

export class OAuthClientGitHub {
  config = {
    client_id: "",
    client_secret: "",
    redirect_uri: "",
    scope: "",
  };

  constructor(settings: Settings) {
    this.config = settings;
  }

  buildTemporaryTokenUrl({ state }: { state?: string | undefined } = {}) {
    const authParams = {
      client_id: this.config.client_id,
      redirect_uri: this.config.redirect_uri,
      scope: this.config.scope,
    } as Record<string, string>;

    if (state) {
      authParams.state = state;
    }

    return buildUrl(AUTH_URL, authParams);
  }

  async requestAccessToken({ code }: { code: string | undefined }) {
    if (typeof code !== "string" || code.length === 0) {
      throw new Error("Missing code");
    }
    const accessTokenParams = {
      client_id: this.config.client_id,
      client_secret: this.config.client_secret,
      redirect_uri: this.config.redirect_uri,
      code,
    };
    return makePostRequest(ACCESS_TOKEN_URL, accessTokenParams);
  }
}

export function init(settings: Settings) {
  return new OAuthClientGitHub(settings);
}
