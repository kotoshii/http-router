import { IControllerMetadata } from '../../metadata/IControllerMetadata'
import { IController } from './IController'
import { MetadataStorage } from '../../metadata/MetadataStorage/MetadataStorage'
import { Container } from 'typedi'
import { IAction } from '../Action/IAction'
import { Action } from '../Action/Action'
import { MiddlewareFunction } from '../../types/MiddlewareFunction'

export class Controller implements IController {
  private readonly _metadataStorage: MetadataStorage = Container.get(MetadataStorage)

  actions: IAction[]

  target: Function

  basePath: string

  middlewares: MiddlewareFunction[]

  constructor(
    controllerMetadata: IControllerMetadata
  ) {
    this.target = controllerMetadata.target
    this.basePath = controllerMetadata.basePath
    this.middlewares = this._metadataStorage.getControllerMiddlewaresMetadata(controllerMetadata).map(
      ({ middlewareFunc }) => middlewareFunc
    )

    this.actions = this._metadataStorage.getControllerActionsMetadata(controllerMetadata).map(
      (actionMetadata) => new Action(this, actionMetadata)
    )
  }
}
