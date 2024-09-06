export const useAuth = () => {
  const sessionCookie = useCookie("session", {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });
  // if session exists return
  // if session does not exist, login then create a new session
  return { sessionCookie };
};
