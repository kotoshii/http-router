import { createServer, Server as NodeServer } from 'http'
import { IServer } from './IServer'
import { Router } from '../../routing/Router/Router'
import { CallbackVoid } from '../../types/CallbackVoid'
import { Container } from 'typedi'
import { HttpMethods } from '../../constants/httpMethods'
import qs from 'qs'
import { Request } from '../../types/Request'
import { Response } from '../../types/Response'
import { MiddlewareFunction } from '../../types/MiddlewareFunction'
import { MetadataStorage } from '../../metadata/MetadataStorage/MetadataStorage'
import cookie from 'cookie'
import { stringifyObject } from '../../utils/stringifyObject'

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
      this.addResponseMethods(res)

      // TODO: Find a way to check a protocol.
      //  Expressjs still uses IncomingMessage.connection.encrypted, though nodejs docs say it's deprecated
      //  also it doesn't exist in current types (req.connection.encrypted is undefined)
      const url = new URL(`https://${req.headers.host}${req.url}`)
      const handler = this._router.getHandler(url.pathname as string, req.method as HttpMethods)

      if (!handler) {
        return res.json({
          status: 404,
          message: 'Route not found'
        }, 404)
      }

      this.parseQueryParams(req, url.search)
      this.parseCookies(req)
      await this.parseBody(req)

      try {
        const [result, allMiddlewaresRun] = handler(req, res)

        if (allMiddlewaresRun) {
          const awaitedResult = await result
          // TODO add possibility to send binary and other non-string data
          return res.end(stringifyObject(awaitedResult))
        }
      } catch (error) {
        return res.json({
          status: 500,
          message: (error as Error).message
        }, 500)
      }
    })
  }

  private parseQueryParams(req: Request, searchParams: string) {
    req.query = qs.parse(searchParams, { ignoreQueryPrefix: true })
  }

  private async parseBody(req: Request) {
    const buffers = []
    for await (const chunk of req) {
      buffers.push(chunk)
    }

    const rawBody = Buffer.concat(buffers).toString()
    req.rawBody = rawBody

    try {
      req.body = JSON.parse(rawBody)
    } catch {
      req.body = rawBody
    }
  }

  private parseCookies(req: Request) {
    if (!req.headers.cookie) {
      req.cookies = {}
      return
    }

    req.cookies = cookie.parse(req.headers.cookie)
  }

  private addResponseMethods(res: Response) {
    res.status = (statusCode) => {
      res.statusCode = statusCode
      return res
    }

    res.json = (data, statusCode) => {
      res.setHeader('content-type', 'application/json')

      if (statusCode) {
        res.status(statusCode)
      }

      res.end(stringifyObject(data))
      return res
    }

    res.html = (data, statusCode) => {
      res.setHeader('content-type', 'text/html')

      if (statusCode) {
        res.status(statusCode)
      }

      res.end(data)
      return res
    }

    res.text = (data, statusCode) => {
      res.setHeader('content-type', 'text/plain')

      if (statusCode) {
        res.status(statusCode)
      }

      res.end(data)
      return res
    }
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
