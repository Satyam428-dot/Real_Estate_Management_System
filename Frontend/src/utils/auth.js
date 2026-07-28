import { jwtDecode } from "jwt-decode";

export function getUserProfileDetails() {
  const token = localStorage.getItem("token");
  const loggedInUserStr = localStorage.getItem("loggedInUser") || localStorage.getItem("user");

  let decoded = {};
  if (token) {
    try {
      decoded = jwtDecode(token);
    } catch (err) {}
  }

  let storedUser = {};
  if (loggedInUserStr) {
    try {
      storedUser = JSON.parse(loggedInUserStr);
    } catch (e) {}
  }

  const firstName =
    storedUser.firstName ||
    decoded.firstName ||
    (storedUser.email
      ? storedUser.email.split("@")[0]
      : decoded.sub
      ? decoded.sub.split("@")[0]
      : "Owner");

  const lastName = storedUser.lastName || decoded.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const email = storedUser.email || decoded.sub || decoded.email || "";
  const role = storedUser.userRole || decoded.role || "OWNER";
  const userId = storedUser.userId || decoded.userId || storedUser.id;

  return {
    userId,
    firstName,
    lastName,
    fullName: fullName || "Property Owner",
    email,
    role,
  };
}

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
