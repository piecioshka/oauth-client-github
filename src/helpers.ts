export function buildUrl(uri: string, params: Record<string, string>) {
  return uri + "?" + new URLSearchParams(params).toString();
}

export async function makePostRequest(
  url: string,
  options: Record<string, string>
) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });
  return await response.json();
}
