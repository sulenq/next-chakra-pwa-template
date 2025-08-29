import { getStorage } from "./client";

export const getUserFromLocalStorage = () => {
  const userData = getStorage("user");
  if (!userData) {
    return null;
  }

  try {
    const parsedUser = JSON.parse(userData);
    return parsedUser;
  } catch (error) {
    console.error("Error parsing user data from local storage:", error);
    return null;
  }
};
