import { IMetadataStorage } from './IMetadataStorage'
import { IControllerMetadata } from '../IControllerMetadata'
import { IActionMetadata } from '../IActionMetadata'
import { HttpMethods } from '../../constants/httpMethods'
import { Service } from 'typedi'
import { IMiddlewareMetadata } from '../IMiddlewareMetadata'
import { MiddlewareFunction } from '../../types/MiddlewareFunction'

@Service()
export class MetadataStorage implements IMetadataStorage {
  private readonly controllersMetadata: IControllerMetadata[] = []
  private readonly actionsMetadata: IActionMetadata[] = []
  private readonly middlewaresMetadata: IMiddlewareMetadata[] = []

  addControllerMetadata(basePath: string, target: Function) {
    this.controllersMetadata.push({
      basePath,
      target
    })
  }

  addActionMetadata(route: string, httpMethod: HttpMethods, target: Object, methodName: string) {
    this.actionsMetadata.push({
      route,
      target,
      methodName,
      httpMethod
    })
  }

  addMiddlewaresMetadata(target: Function | null, methodName: string | null, middlewares: MiddlewareFunction[]) {
    const metadata = middlewares.map<IMiddlewareMetadata>((func) => ({
      target,
      methodName,
      middlewareFunc: func
    }))

    this.middlewaresMetadata.push(...metadata)
  }

  getControllerActionsMetadata(controllerMetadata: IControllerMetadata) {
    return this.actionsMetadata.filter(
      (actionMetadata) => actionMetadata.target.constructor === controllerMetadata.target
    )
  }

  getControllersMetadata() {
    return this.controllersMetadata
  }

  getControllerMiddlewaresMetadata(controller: IControllerMetadata): IMiddlewareMetadata[] {
    return this.middlewaresMetadata.filter(
      (middlewareMetadata) =>
        middlewareMetadata.target === controller.target && !middlewareMetadata.methodName
    )
  }

  getActionMiddlewaresMetadata(action: IActionMetadata): IMiddlewareMetadata[] {
    return this.middlewaresMetadata.filter(
      (middlewareMetadata) =>
        middlewareMetadata.target === action.target.constructor && middlewareMetadata.methodName === action.methodName
    )
  }

  getGlobalMiddlewaresMetadata(): IMiddlewareMetadata[] {
    return this.middlewaresMetadata.filter(
      (middlewareMetadata) => !middlewareMetadata.target && !middlewareMetadata.methodName
    )
  }
}
