export default defineNuxtRouteMiddleware((to, _from) => {
  const sessionCookie = useCookie("session");

  // No session cookie
  if (!sessionCookie.value) {
    // Not going to signin or signup
    if (to.path !== "/signin" && to.path !== "/signup") {
      // Force navigate to signin
      return navigateTo("/signin");
    }
  }

  // Has session cookie
  if (sessionCookie.value) {
    // Going to signin or signup
    if (to.path === "/signin" || to.path === "/signup") {
      // Force navigate to home
      return navigateTo("/");
    }
  }
});
