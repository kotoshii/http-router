import { ServerResponse } from 'http'

export interface Response extends ServerResponse {
  json(data: unknown, statusCode?: number): Response
  html(data: string, statusCode?: number): Response
  text(data: string, statusCode?: number): Response
  status(statusCode: number): Response
}
