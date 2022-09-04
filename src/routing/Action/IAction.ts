import { IController } from '../Controller/IController'
import { IActionMetadata } from '../../metadata/IActionMetadata'
import { Match } from 'path-to-regexp'

export interface IAction extends IActionMetadata {
  controller: IController;

  target: Function

  fullRoute: string

  matchRoute(path: string): Match
}
