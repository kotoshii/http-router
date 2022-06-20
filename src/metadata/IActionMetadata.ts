import { HttpMethod } from '../types/HttpMethod'

export interface IActionMetadata {
  target: Object;
  route: string;
  methodName: string;
  httpMethod: HttpMethod;
}
