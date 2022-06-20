import { RequestHandler } from './RequestHandler'

export type ControllerInstance = {
  [key:string]: RequestHandler
}
