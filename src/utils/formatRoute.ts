export function formatRoute(route: string): string {
  let formattedRoute = route

  if (!formattedRoute.startsWith('/')) { formattedRoute = '/' + formattedRoute }
  if (!formattedRoute.endsWith('/')) { formattedRoute = formattedRoute + '/' }

  return formattedRoute
}
