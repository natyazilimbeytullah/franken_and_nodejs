export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const { isAuthenticated } = useJwtAuth()

  const publicPages = ['/login', '/register', '/forgot']
  const isPublicPage = publicPages.includes(to.path)

  if (!isAuthenticated() && !isPublicPage) {
    return navigateTo('/login')
  }

  if (isAuthenticated() && isPublicPage) {
    return navigateTo('/dashboard')
  }
})
