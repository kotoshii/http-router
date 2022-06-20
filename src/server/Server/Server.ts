import { createServer, IncomingMessage, Server as NodeServer, ServerResponse } from 'http'
import { IServer } from './IServer'
import { Router } from '../../routing/Router/Router'
import { CallbackVoid } from '../../types/CallbackVoid'
import { Container } from 'typedi'
import { HttpMethod } from '../../types/HttpMethod'

export class Server implements IServer {
  private readonly _server: NodeServer
  private readonly _router: Router = Container.get(Router)

  constructor() {
    this._server = createServer()

    this._router.mapRoutes()
    this.addListeners()
  }

  private addListeners() {
    this._server.on('request', (req: IncomingMessage, res: ServerResponse) => {
      const handler = this._router.getHandler(req.url as string, req.method as HttpMethod)

      if (!handler) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({
          status: 404,
          message: 'Route not found'
        }))
      }

      res.statusCode = 200

      return res.end(handler(req, res))
    })
  }

  public listen(port: number | string, callback?: CallbackVoid) {
    this._server.listen(port, callback)
  }
}
