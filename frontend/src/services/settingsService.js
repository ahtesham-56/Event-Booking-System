import api from "./api";

/*
  Admin settings
*/

export const getAdminSettings = async () => {
  const response = await api.get("/settings/admin");
  return response.data;
};

export const updateAdminSettings = async (settings) => {
  const response = await api.put(
    "/settings/admin",
    settings
  );

  return response.data;
};

/*
  User settings
*/

export const getUserSettings = async () => {
  const response = await api.get("/settings/user");
  return response.data;
};

export const updateUserSettings = async (settings) => {
  const response = await api.put(
    "/settings/user",
    settings
  );

  return response.data;
};