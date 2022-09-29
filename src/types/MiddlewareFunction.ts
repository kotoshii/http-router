import { Request } from './Request'
import { Response } from './Response'

// TODO find a way to change unknown to something more specific
// TODO change next function type signature
export type MiddlewareFunction = (req?: Request, res?: Response, next?: () => void) => unknown
