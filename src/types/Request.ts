import { IncomingMessage } from 'http'
import { ParsedQs } from 'qs'

export interface Request extends IncomingMessage {
  query: ParsedQs
  params: Record<string, string>
  body: string | number | null | Record<string, unknown>
  rawBody: string
}
