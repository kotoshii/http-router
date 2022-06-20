import { IMetadataStorage } from './IMetadataStorage'
import { IControllerMetadata } from '../IControllerMetadata'
import { IActionMetadata } from '../IActionMetadata'
import { HttpMethod } from '../../types/HttpMethod'
import { Service } from 'typedi'

@Service()
export class MetadataStorage implements IMetadataStorage {
  private readonly controllersMetadata: IControllerMetadata[] = []
  private readonly actionsMetadata: IActionMetadata[] = []

  addControllerMetadata(basePath: string, target: Function) {
    this.controllersMetadata.push({
      basePath,
      target
    })
  }

  addActionMetadata(route: string, httpMethod: HttpMethod, target: Object, methodName: string) {
    this.actionsMetadata.push({
      route,
      target,
      methodName,
      httpMethod
    })
  }

  getControllerActionsMetadata(controllerMetadata: IControllerMetadata) {
    return this.actionsMetadata.filter(
      (actionMetadata) => actionMetadata.target.constructor === controllerMetadata.target
    )
  }

  getControllersMetadata() {
    return this.controllersMetadata
  }
}
