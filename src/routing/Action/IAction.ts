import { IController } from '../Controller/IController'
import { IActionMetadata } from '../../metadata/IActionMetadata'
import { Match } from 'path-to-regexp'
import { MiddlewareFunction } from '../../types/MiddlewareFunction'

export interface IAction extends IActionMetadata {
  controller: IController;

  target: Function

  fullRoute: string

  middlewares: MiddlewareFunction[]

  matchRoute(path: string): Match
}
