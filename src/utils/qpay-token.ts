import NodeCache from "node-cache";
import log from "./logger";
import httpRequest from "./request-builder";

const tokenCache = new NodeCache();

interface TokenRequest {
  username: string;
  password: string;
}

interface TokenResponse {
  token_type: string;
  refresh_expires_in: number;
  refresh_token: string;
  access_token: string;
  expires_in: number;
  scope: string;
  "not-before-policy": string;
  session_state: string;
}

type TokenData = {
  token: string;
  expiresAt: number;
};

export const getQPayToken = async () => {
  const username = "MGLSTEM_EDU";
  const password = "eGVjSf7A";

  const basicauth = btoa(`${username}:${password}`);

  const result = await httpRequest<null, TokenResponse>(
    "POST",
    "https://merchant.qpay.mn/v2/auth/token",
    undefined,
    {
      headers: {
        Authorization: `Basic ${basicauth}`,
      },
    }
  );

  if (result.error) {
    log("error", "Failed get new token", result.error);
    return;
  }
  log("info", "New token set to storeToken");
  storeToken(username, result.data.access_token);
  return result.data.access_token;
};

export const getToken = () => {
  const username = "MGLSTEM_EDU";
  try {
    const data = tokenCache.get<TokenData>(username);
    if (!data) return null;
    if (Date.now() > data.expiresAt) {
      tokenCache.del(username);
      log("info", "delete token");
      return null;
    }
    return data.token;
  } catch (err) {
    log("error", "Токен кэшлэхэд алдаа гарлаа", err);
  }
};

const storeToken = (userId: string, token: string): void => {
  const expiresAt = Date.now() + 36000 * 1000;
  const tokenData: TokenData = { token, expiresAt };
  tokenCache.set(userId, tokenData, expiresAt);
};
