import { MetadataStorage } from '../../metadata/MetadataStorage/MetadataStorage'
import { Container } from 'typedi'
import { MiddlewareFunction } from '../../types/MiddlewareFunction'

export const Get = (route?: string, middlewares?: MiddlewareFunction[]): MethodDecorator => {
  const metadataStorage = Container.get(MetadataStorage)

  return (target, propertyKey) => {
    metadataStorage.addActionMetadata(route || '', 'GET', target, propertyKey as string)

    if (middlewares?.length) {
      metadataStorage.addMiddlewaresMetadata(target.constructor, propertyKey as string, middlewares)
    }
  }
}
