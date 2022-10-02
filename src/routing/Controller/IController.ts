import { IAction } from '../Action/IAction'
import { IControllerMetadata } from '../../metadata/IControllerMetadata'
import { MiddlewareFunction } from '../../types/MiddlewareFunction'

export interface IController extends IControllerMetadata {
  actions: IAction[]
  middlewares: MiddlewareFunction[]
}
