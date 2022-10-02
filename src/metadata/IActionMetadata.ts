import { HttpMethods } from '../constants/httpMethods'

export interface IActionMetadata {
  target: Object;
  route: string;
  methodName: string;
  httpMethod: HttpMethods;
}
