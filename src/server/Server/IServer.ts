import { CallbackVoid } from '../../types/CallbackVoid'
import { MiddlewareFunction } from '../../types/MiddlewareFunction';

export interface IServer {
    listen(port: number | string, callback?: CallbackVoid): IServer
    useMiddleware(...middlewares: MiddlewareFunction[]): IServer
}
