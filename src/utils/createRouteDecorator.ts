import { Container } from 'typedi'
import { MetadataStorage } from '../metadata/MetadataStorage/MetadataStorage'
import { HttpMethods } from '../constants/httpMethods'
import { MiddlewareFunction } from '../types/MiddlewareFunction'

const metadataStorage = Container.get(MetadataStorage)

export function createRouteDecorator(httpMethod: HttpMethods) {
  return (route?: string, middlewares?: MiddlewareFunction[]): MethodDecorator => {
    return (target, propertyKey) => {
      metadataStorage.addActionMetadata(route || '', httpMethod, target, propertyKey as string)

      if (middlewares?.length) {
        metadataStorage.addMiddlewaresMetadata(target.constructor, propertyKey as string, middlewares)
      }
    }
  }
}
