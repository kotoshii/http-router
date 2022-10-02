import { IRouter } from './IRouter'
import { Container, Service } from 'typedi'
import { HttpMethods } from '../../constants/httpMethods'
import { MetadataStorage } from '../../metadata/MetadataStorage/MetadataStorage'
import { Controller } from '../Controller/Controller'
import { flatten, groupBy } from 'lodash'
import { RequestHandler } from '../../types/RequestHandler'
import { ControllerInstance } from '../../types/ControllerInstance'
import { formatRoute } from '../../utils/formatRoute'
import { Request } from '../../types/Request'
import { Response } from '../../types/Response'
import { IAction } from '../Action/IAction'
import { MiddlewareFunction } from '../../types/MiddlewareFunction'

@Service()
export class Router implements IRouter {
  private _actionsMap = new Map<HttpMethods, IAction[]>()

  constructor(
    private readonly _metadataStorage: MetadataStorage
  ) {}

  getHandler(route: string, method: HttpMethods): RequestHandler | null {
    const actions = this._actionsMap.get(method as HttpMethods)

    if (!actions) {
      return null
    }

    let action: IAction | null = null
    let params: Record<string, string> = {}

    for (const a of actions) {
      const result = a.matchRoute(formatRoute(route))
      if (result) {
        action = a
        params = result.params as Record<string, string>
        break
      }
    }

    if (!action) {
      return null
    }

    const { target, methodName } = action
    const controllerInstance = Container.get<ControllerInstance>(target)

    const globalMiddlewares = this._metadataStorage.getGlobalMiddlewaresMetadata().map(
      ({ middlewareFunc }) => middlewareFunc
    )

    const handlerMiddlewares = [...globalMiddlewares, ...action.controller.middlewares, ...action.middlewares]

    return this.createHandler(controllerInstance, methodName, params, handlerMiddlewares)
  }

  mapRoutes() {
    const controllers: Controller[] = this._metadataStorage.getControllersMetadata().map(
      (controllerMetadata) => new Controller(controllerMetadata)
    )

    const actionsByHttpMethod = groupBy(flatten(controllers.map((controller) => controller.actions)), 'httpMethod')

    for (const httpMethod in actionsByHttpMethod) {
      this._actionsMap.set(httpMethod as HttpMethods, actionsByHttpMethod[httpMethod])
    }
  }

  private createHandler(
    controllerInstance: ControllerInstance,
    methodName: string,
    params: Record<string, string>,
    middlewares: MiddlewareFunction[]
  ): RequestHandler {
    return function(req: Request, res: Response) {
      req.params = Object.assign({}, params)

      let index = 0

      const next = () => {
        const middleware = middlewares[index++]

        if (!middleware) return
        middleware(req, res, next)
      }

      next()

      return [
        controllerInstance[methodName](req, res),
        index - 1 === middlewares.length
      ]
    }
  }
}
