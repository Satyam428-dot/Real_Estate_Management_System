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
