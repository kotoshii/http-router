import { Request } from './Request'
import { Response } from './Response'

export type ControllerInstance = {
  [key:string]: (req: Request, res: Response) => unknown
}
