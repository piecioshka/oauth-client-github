const STORAGE_KEY = "token";
const GITHUB_PROFILE_URL = "https://api.github.com/user";

const TokenRepository = {
  get: () => CookieManager.get(STORAGE_KEY),
  clean: () => CookieManager.delete(STORAGE_KEY),
};

async function makeAuthRequest(token, url) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
}

function renderApp({ user }) {
  const $app = document.querySelector("#app");

  if (!$app) {
    throw new Error('Element "#app" is missing');
  }

  if (!user) {
    $app.innerHTML = `
      <button class="sign-in">sign in via GitHub</button>
    `;

    document.querySelector("button.sign-in")?.addEventListener("click", () => {
      location.href = "/auth";
    });
  } else {
    $app.innerHTML = `
      <button class="sign-out">sign out</button>
      <div id="user" style="margin-top: 10px;">
        <img src="${user.avatar_url}" alt="" style="width: 100px" />
        <ul>
          <li>name: <strong>${user.name}</strong></li>
          <li>login: <a href="https://github.com/${user.login}" target="_blank">${user.login}</a></li>
          <li>public_repos: <strong>${user.public_repos}</strong></li>
          <li>owned_private_repos: <strong>${user.owned_private_repos}</strong></li>
        </ul>
      </div>
    `;
    document.querySelector("button.sign-out")?.addEventListener("click", () => {
      TokenRepository.clean();
      location.reload();
    });
  }
}

async function main() {
  console.debug("piecioshka, main");
  const access_token = TokenRepository.get();

  if (access_token) {
    const user = await makeAuthRequest(access_token, GITHUB_PROFILE_URL);
    console.info("piecioshka, main", { user });
    renderApp({ user });
  } else {
    console.warn("piecioshka, main", "Access token is missing");
    renderApp({ user: null });
  }
}

main();
