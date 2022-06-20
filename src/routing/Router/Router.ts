import { IRouter } from './IRouter'
import { Container, Service } from 'typedi'
import { HttpMethod } from '../../types/HttpMethod'
import { RouteMetadata } from '../../types/RouteMetadata'
import { MetadataStorage } from '../../metadata/MetadataStorage/MetadataStorage'
import { Controller } from '../Controller/Controller'
import { flatten, groupBy } from 'lodash'
import { RequestHandler } from '../../types/RequestHandler'
import { IncomingMessage, ServerResponse } from 'http'
import { ControllerInstance } from '../../types/ControllerInstance'
import { formatRoute } from '../../utils/formatRoute'

@Service()
export class Router implements IRouter {
  private readonly _routes = new Map<HttpMethod, RouteMetadata>()

  constructor(
    private readonly _metadataStorage: MetadataStorage
  ) {}

  getHandler(route: string, method: HttpMethod): RequestHandler | null {
    const routeMetadata = this._routes.get(method as HttpMethod)

    if (!routeMetadata) {
      return null
    }

    const { target, methodName } = routeMetadata[formatRoute(route)]
    const controllerInstance = Container.get<ControllerInstance>(target)

    return this.createHandler(controllerInstance, methodName)
  }

  mapRoutes() {
    const controllers: Controller[] = this._metadataStorage.getControllersMetadata().map(
      (controllerMetadata) => new Controller(controllerMetadata)
    )

    const actionsByHttpMethod = groupBy(flatten(controllers.map((controller) => controller.actions)), 'httpMethod')

    for (const httpMethod in actionsByHttpMethod) {
      const routeMetadata: RouteMetadata = {}

      for (const action of actionsByHttpMethod[httpMethod]) {
        routeMetadata[action.fullRoute] = {
          target: action.target,
          methodName: action.methodName
        }
      }

      this._routes.set(httpMethod as HttpMethod, routeMetadata)
    }
  }

  private createHandler(controllerInstance: ControllerInstance, methodName: string): RequestHandler {
    return function(req: IncomingMessage, res: ServerResponse) {
      // eslint-disable-next-line no-useless-call
      return controllerInstance[methodName]
        .call<ControllerInstance, [IncomingMessage, ServerResponse], unknown>(controllerInstance, req, res)
    }
  }
}
