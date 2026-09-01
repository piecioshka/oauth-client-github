require("dotenv").config({ quiet: true });

const path = require("path");
const process = require("process");
const port = process.env.PORT;

const express = require("express");
const morgan = require("morgan");
const app = express();

let oauthClientGitHub = null;

try {
  oauthClientGitHub = require("oauth-client-github");
} catch (error) {
  if (error && error.code !== "MODULE_NOT_FOUND") {
    throw error;
  }
}

const settings = {
  client_id: process.env.GITHUB_CLIENT_ID,
  client_secret: process.env.GITHUB_CLIENT_SECRET,
  redirect_uri: process.env.GITHUB_REDIRECT_URI,
  scope: process.env.GITHUB_SCOPE,
};
const githubAuth = oauthClientGitHub ? oauthClientGitHub.init(settings) : null;

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "../client/")));

app.get("/auth", async (req, res) => {
  if (!githubAuth) {
    res.status(500).send("OAuth client is unavailable");
    return;
  }

  const state = req.headers.referer;
  const url = await githubAuth.buildTemporaryTokenUrl({ state });
  res.redirect(url);
});

// Allow only same-origin redirect targets to prevent an open redirect.
function buildRedirectPath(state) {
  const raw = Array.isArray(state) ? state[0] : state;
  if (typeof raw !== "string" || raw.length === 0) {
    return "/";
  }

  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
    return "/";
  }

  try {
    const url = new URL(trimmed, "http://localhost");
    return url.pathname + url.search + url.hash;
  } catch {
    // Ignore unparsable values and fall back to the default path.
    return "/";
  }
}

app.get("/auth/callback", async (req, res) => {
  if (!githubAuth) {
    res.status(500).send("OAuth client is unavailable");
    return;
  }

  const { code, state } = req.query;
  const response = await githubAuth.requestAccessToken({
    code: code ? String(code) : undefined,
  });
  if (response.error) {
    res.redirect("/auth");
    return;
  }
  res.cookie("token", response.access_token);
  res.redirect(buildRedirectPath(state));
});

if (require.main === module) {
  app.listen(port, () => {
    console.log("Server is running at http://localhost:" + port);
  });
}

module.exports = {
  app,
  buildRedirectPath,
};
