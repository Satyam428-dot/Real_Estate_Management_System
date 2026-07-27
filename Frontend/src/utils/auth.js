import { jwtDecode } from "jwt-decode";

export function getLoggedInUser() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (err) {
    return null;
  }
}

export function isAuthenticated() {
  const user = getLoggedInUser();
  return Boolean(user && (!user.exp || user.exp * 1000 > Date.now()));
}

export function getUserRole() {
  return getLoggedInUser()?.role;
}
