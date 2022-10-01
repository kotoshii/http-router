import { Request } from './Request'
import { Response } from './Response'

export type MiddlewareFunction = (req: Request, res: Response, next: () => void) => unknown | Promise<unknown>
