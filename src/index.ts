import 'reflect-metadata'
import { Server } from './server/Server/Server'

export { Controller } from './decorators/Controller'
export * from './decorators/routes'
export { MiddlewareFunction } from './types/MiddlewareFunction'
export { Request } from './types/Request'
export { Response } from './types/Response'
export { HttpMethods } from './constants/httpMethods'
export * from 'typedi'

export function createServer() {
  return new Server()
}
