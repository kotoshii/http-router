import { IncomingMessage } from 'http'
import { ParsedQs } from 'qs'

export interface Request extends IncomingMessage {
  query: ParsedQs
}
