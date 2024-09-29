require("dotenv").config();

const path = require("path");
const process = require("process");
const port = process.env.PORT;

const express = require("express");
const morgan = require("morgan");
const app = express();

const oauthClientGitHub = require("oauth-client-github");
const settings = {
  client_id: process.env.GITHUB_CLIENT_ID,
  client_secret: process.env.GITHUB_CLIENT_SECRET,
  redirect_uri: process.env.GITHUB_REDIRECT_URI,
  scope: process.env.GITHUB_SCOPE,
};
const githubAuth = oauthClientGitHub.init(settings);

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "../client/")));

app.get("/auth", async (req, res) => {
  const state = req.headers.referer;
  const url = await githubAuth.buildTemporaryTokenUrl({ state });
  res.redirect(url);
});

app.get("/auth/callback", async (req, res) => {
  const { code, state } = req.query;
  const response = await githubAuth.requestAccessToken({
    code: code ? String(code) : undefined,
  });
  if (response.error) {
    res.redirect("/auth");
    return;
  }
  res.cookie("token", response.access_token);
  res.redirect(state ? String(state) : "/");
});

app.listen(port, () => {
  console.log("Server is running at http://localhost:" + port);
});
