export const getAuthToken = async (user) => {
  if (!user) {
    return null;
  }

  if (typeof user.getIdToken === "function") {
    try {
      return await user.getIdToken();
    } catch {
      return user.accessToken || null;
    }
  }

  return user.accessToken || null;
};

export const buildAuthHeaders = async (user, extraHeaders = {}) => {
  const token = await getAuthToken(user);

  if (!token) {
    return { ...extraHeaders };
  }

  return {
    ...extraHeaders,
    Authorization: `Bearer ${token}`,
  };
};
