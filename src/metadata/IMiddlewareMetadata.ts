import { MiddlewareFunction } from '../types/MiddlewareFunction'

export interface IMiddlewareMetadata {
  target: Function | null;
  methodName: string | null
  middlewareFunc: MiddlewareFunction
}
