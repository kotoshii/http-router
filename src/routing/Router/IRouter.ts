import { RequestHandler } from '../../types/RequestHandler'

export interface IRouter {
    getHandler(route: string, method: string): RequestHandler | null
    mapRoutes(): void
}
