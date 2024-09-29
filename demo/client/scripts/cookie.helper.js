const CookieManager = {
  get: (name) => {
    return document.cookie
      .split(", ")
      .find((cookie) => {
        const [key, _value] = cookie.split("=");
        return key === name;
      })
      ?.split("=")[1];
  },
  delete: (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },
};
