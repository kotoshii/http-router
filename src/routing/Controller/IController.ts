import { IAction } from '../Action/IAction'
import { IControllerMetadata } from '../../metadata/IControllerMetadata'

export interface IController extends IControllerMetadata {
  actions: IAction[]
}
