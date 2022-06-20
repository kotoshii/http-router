import 'reflect-metadata'
import { Server } from './server/Server/Server'

export * from './decorators/Controller'
export * from './decorators/methods/Get'

export function createServer() {
  return new Server()
}
