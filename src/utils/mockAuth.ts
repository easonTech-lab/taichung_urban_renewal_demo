const ADMIN_USER = {
  username: "adm",
  role: "admin",
  email: "adm@example.com",
};

export const ensureAdminSession = () => {
  localStorage.setItem("userInfo", JSON.stringify(ADMIN_USER));
  return ADMIN_USER;
};

export const getCurrentUser = () => {
  const raw = localStorage.getItem("userInfo");

  if (!raw) {
    return ensureAdminSession();
  }

  try {
    const user = JSON.parse(raw);
    if (user?.username === "adm" && user?.role === "admin") {
      return user;
    }
  } catch {
    // Ignore parse errors and restore the fixed admin session.
  }

  return ensureAdminSession();
};

export const isAdminUser = () => getCurrentUser().role === "admin";
