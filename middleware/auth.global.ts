export default defineNuxtRouteMiddleware((to, _from) => {
  const sessionCookie = useCookie("session");

  if (!sessionCookie.value) {
    if (to.path !== "/signin") {
      return navigateTo("/signin");
    }
  }

  if (sessionCookie.value) {
    if (to.path === "/signin") {
      return navigateTo("/");
    }
  }
});
