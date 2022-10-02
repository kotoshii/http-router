import { IAction } from './IAction'
import { IController } from '../Controller/IController'
import { IActionMetadata } from '../../metadata/IActionMetadata'
import { HttpMethods } from '../../constants/httpMethods'
import path from 'path/posix'
import { formatRoute } from '../../utils/formatRoute'
import { match, MatchFunction } from 'path-to-regexp'
import { MetadataStorage } from '../../metadata/MetadataStorage/MetadataStorage'
import { Container } from 'typedi'
import { MiddlewareFunction } from '../../types/MiddlewareFunction'

export class Action implements IAction {
  private readonly matchRouteFn: MatchFunction

  private readonly _metadataStorage: MetadataStorage = Container.get(MetadataStorage)

  controller: IController

  target: Function

  httpMethod: HttpMethods

  methodName: string

  route: string

  fullRoute: string

  middlewares: MiddlewareFunction[]

  constructor(controller: IController, actionMetadata: IActionMetadata) {
    const { target, httpMethod, methodName, route } = actionMetadata

    this.controller = controller
    this.target = target.constructor
    this.httpMethod = httpMethod
    this.methodName = methodName
    this.route = route
    this.fullRoute = this.buildRoute()
    this.matchRouteFn = match(this.fullRoute)
    this.middlewares = this._metadataStorage.getActionMiddlewaresMetadata(actionMetadata).map(
      ({ middlewareFunc }) => middlewareFunc
    )
  }

  public matchRoute(path: string) {
    return this.matchRouteFn(path)
  }

  private buildRoute() {
    return formatRoute(path.join(this.controller.basePath, this.route))
  }
}
