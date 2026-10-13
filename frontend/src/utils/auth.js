const TOKEN_KEY = "token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Reads the JWT payload. This is only for UI decisions (like hiding buttons);
// the server always verifies the token itself.
const decodePayload = (token) => {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

export const isLoggedIn = () => {
  const token = getToken();
  if (!token) return false;
  const payload = decodePayload(token);
  if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
    clearToken();
    return false;
  }
  return true;
};

export const getUserId = () => {
  if (!isLoggedIn()) return null;
  return decodePayload(getToken())?.id || null;
};
