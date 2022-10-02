import { HttpMethods } from '../../constants/httpMethods'
import { IControllerMetadata } from '../IControllerMetadata'
import { IActionMetadata } from '../IActionMetadata'
import { MiddlewareFunction } from '../../types/MiddlewareFunction'
import { IMiddlewareMetadata } from '../IMiddlewareMetadata'

export interface IMetadataStorage {
  addControllerMetadata(basePath: string, target: Function): void
  addActionMetadata(route: string, httpMethod: HttpMethods, target: Function, methodName: string): void
  addMiddlewaresMetadata(target: Function | null, methodName: string | null, middlewares: MiddlewareFunction[]): void
  getControllerActionsMetadata(controller: IControllerMetadata): IActionMetadata[]
  getControllersMetadata(): IControllerMetadata[]
  getControllerMiddlewaresMetadata(controller: IControllerMetadata): IMiddlewareMetadata[]
  getActionMiddlewaresMetadata(action: IActionMetadata): IMiddlewareMetadata[]
  getGlobalMiddlewaresMetadata(): IMiddlewareMetadata[]
}
