import { IController } from '../Controller/IController'
import { IActionMetadata } from '../../metadata/IActionMetadata'

export interface IAction extends IActionMetadata {
  controller: IController;

  target: Function

  fullRoute: string
}
