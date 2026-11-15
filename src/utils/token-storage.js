const TOKEN_KEY = "admin_token";
const USER_KEY = "admin_user";

export function setAdminToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function setAdminUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAdminUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function adminLogout() {
  removeAdminToken();
  localStorage.removeItem(USER_KEY);
}