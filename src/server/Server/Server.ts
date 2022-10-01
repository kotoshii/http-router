import { createServer, Server as NodeServer } from 'http'
import { IServer } from './IServer'
import { Router } from '../../routing/Router/Router'
import { CallbackVoid } from '../../types/CallbackVoid'
import { Container } from 'typedi'
import { HttpMethod } from '../../types/HttpMethod'
import qs from 'qs'
import { Request } from '../../types/Request'
import { Response } from '../../types/Response'
import { MiddlewareFunction } from '../../types/MiddlewareFunction'
import { MetadataStorage } from '../../metadata/MetadataStorage/MetadataStorage'

export class Server implements IServer {
  private readonly _server: NodeServer
  private readonly _router: Router = Container.get(Router)
  private readonly _metadataStorage: MetadataStorage = Container.get(MetadataStorage)

  constructor() {
    this._server = createServer()

    this._router.mapRoutes()
    this.addListeners()
  }

  private addListeners() {
    this._server.on('request', async (req: Request, res: Response) => {
      // TODO: Find a way to check a protocol.
      //  Expressjs still uses IncomingMessage.connection.encrypted, though nodejs docs say it's deprecated
      //  also it doesn't exist in current types (req.connection.encrypted is undefined)
      const url = new URL(`http://${req.headers.host}${req.url}`)
      const handler = this._router.getHandler(url.pathname as string, req.method as HttpMethod)

      if (!handler) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({
          status: 404,
          message: 'Route not found'
        }))
      }

      req.query = this.parseQueryParams(url.search)

      try {
        const [result, allMiddlewaresRun] = handler(req, res)

        if (allMiddlewaresRun) {
          const awaitedResult = await result
          return res.end(typeof awaitedResult === 'string' ? awaitedResult : JSON.stringify(awaitedResult))
        }
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({
          status: 500,
          message: (error as Error).message
        }))
      }
    })
  }

  private parseQueryParams(searchParams: string) {
    return qs.parse(searchParams, { ignoreQueryPrefix: true })
  }

  public listen(port: number | string, callback?: CallbackVoid) {
    this._server.listen(port, callback)
    return this
  }

  public useMiddleware(...middlewares: MiddlewareFunction[]): IServer {
    this._metadataStorage.addMiddlewaresMetadata(null, null, middlewares)
    return this
  }
}
