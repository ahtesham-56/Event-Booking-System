import api from "./api";

// =========================================================
// GET MY PROFILE
// =========================================================

export const getMyProfile = async () => {
  const response = await api.get("/users/profile/me");

  return response.data;
};

// =========================================================
// UPDATE MY PROFILE
// =========================================================

export const updateMyProfile = async (profileData) => {
  const response = await api.put(
    "/users/profile/me",
    profileData
  );

  return response.data;
};

// =========================================================
// CHANGE PASSWORD
// =========================================================

export const changePassword = async (passwordData) => {
  const response = await api.put(
    "/users/change-password",
    passwordData
  );

  return response.data;
};