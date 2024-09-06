export const useSession = () => {
  const sessionCookie = useCookie("session", {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });

  return { sessionCookie };
};
