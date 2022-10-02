import 'reflect-metadata'
import { Server } from './server/Server/Server'

export * from './decorators/Controller'
export * from './decorators/routes'

export function createServer() {
  return new Server()
}
