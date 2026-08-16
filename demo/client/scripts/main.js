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

  const flowStrip = `
    <p class="card-flow">
      /auth <span class="card-flow-arrow">&rarr;</span> github.com
      <span class="card-flow-arrow">&rarr;</span> /auth/callback
      <span class="card-flow-arrow">&rarr;</span> cookie
    </p>
    <p class="card-footer">
      <a href="https://github.com/piecioshka/oauth-client-github">piecioshka/oauth-client-github</a>
    </p>
  `;

  if (!user) {
    $app.innerHTML = `
      <main class="card">
        <p class="card-eyebrow">oauth-client-github &middot; demo</p>
        <h1 class="card-title">Sign in with GitHub in one click</h1>
        <button class="sign-in">
          <svg class="sign-in-mark" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/>
          </svg>
          Sign in via GitHub
        </button>
        ${flowStrip}
      </main>
    `;

    document.querySelector("button.sign-in")?.addEventListener("click", () => {
      location.href = "/auth";
    });
  } else {
    $app.innerHTML = `
      <main class="card">
        <img class="profile-avatar" src="${user.avatar_url}" alt="" />
        <h1 class="profile-name">${user.name}</h1>
        <a class="profile-login" href="https://github.com/${user.login}" target="_blank">@${user.login}</a>
        <div class="profile-stats">
          <span class="profile-stats-label">public_repos</span>
          <span class="profile-stats-value">${user.public_repos}</span>
        </div>
        <button class="sign-out">Sign out</button>
        ${flowStrip}
      </main>
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
