export default defineNuxtRouteMiddleware((to, _from) => {
  const sessionCookie = useCookie("session");
  if (!sessionCookie.value) {
    if (to.path !== "/login") {
      return navigateTo("/login");
    }
  }
});
