import { jwtDecode } from "jwt-decode";

export function getLoggedInUser() {
  const token = localStorage.getItem("token");
  const loggedInUserStr = localStorage.getItem("loggedInUser");

  let userObj = null;

  if (token) {
    try {
      userObj = jwtDecode(token);
    } catch (err) {
      // Invalid or plain token
    }
  }

  if (!userObj && loggedInUserStr) {
    try {
      userObj = JSON.parse(loggedInUserStr);
    } catch (e) {
      // Ignored
    }
  }

  return userObj;
}

export function isAuthenticated() {
  const token = localStorage.getItem("token");
  const loggedInUser = localStorage.getItem("loggedInUser");
  
  if (!token && !loggedInUser) return false;

  const user = getLoggedInUser();
  if (!user) return false;

  if (user.exp && user.exp * 1000 <= Date.now()) {
    return false;
  }
  
  return true;
}

export function getUserRole() {
  const user = getLoggedInUser();

  let rawRole = null;

  if (user) {
    rawRole = user.userRole || user.role;
    if (!rawRole && user.roles) {
      rawRole = Array.isArray(user.roles) ? user.roles[0] : user.roles;
    }
    if (!rawRole && user.authorities) {
      if (Array.isArray(user.authorities)) {
        const auth = user.authorities[0];
        rawRole = typeof auth === "string" ? auth : auth?.authority;
      }
    }
  }

  if (!rawRole) {
    try {
      const stored = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
      rawRole = stored.userRole || stored.role;
    } catch (e) {}
  }

  if (typeof rawRole === "string") {
    return rawRole.replace("ROLE_", "").toUpperCase();
  }

  return null;
}
