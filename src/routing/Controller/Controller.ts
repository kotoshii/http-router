import { IControllerMetadata } from '../../metadata/IControllerMetadata'
import { IController } from './IController'
import { MetadataStorage } from '../../metadata/MetadataStorage/MetadataStorage'
import { Container } from 'typedi'
import { IAction } from '../Action/IAction'
import { Action } from '../Action/Action'

export class Controller implements IController {
  private readonly _metadataStorage: MetadataStorage = Container.get(MetadataStorage)

  actions: IAction[]

  target: Function

  basePath: string

  constructor(
    controllerMetadata: IControllerMetadata
  ) {
    this.target = controllerMetadata.target
    this.basePath = controllerMetadata.basePath
    this.actions = this._metadataStorage.getControllerActionsMetadata(controllerMetadata).map(
      (actionMetadata) => new Action(this, actionMetadata)
    )
  }
}
