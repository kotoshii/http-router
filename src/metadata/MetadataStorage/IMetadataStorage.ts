import { HttpMethod } from '../../types/HttpMethod'
import { IControllerMetadata } from '../IControllerMetadata'
import { IActionMetadata } from '../IActionMetadata'

export interface IMetadataStorage {
  addControllerMetadata(basePath: string, target: Function): void
  addActionMetadata(route: string, httpMethod: HttpMethod, target: Function, methodName: string): void
  getControllerActionsMetadata(controller: IControllerMetadata): IActionMetadata[]
  getControllersMetadata(): IControllerMetadata[]
}
