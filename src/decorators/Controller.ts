import { MetadataStorage } from '../metadata/MetadataStorage/MetadataStorage'
import { Constructable, Container } from 'typedi'
import { MiddlewareFunction } from '../types/MiddlewareFunction'

export const Controller = (basePath?: string, middlewares?: MiddlewareFunction[]): ClassDecorator => {
  const metadataStorage = Container.get(MetadataStorage)

  return (target) => {
    metadataStorage.addControllerMetadata(basePath || '', target)

    if (middlewares?.length) {
      metadataStorage.addMiddlewaresMetadata(target, null, middlewares)
    }

    Container.set({
      id: target,
      type: target as unknown as Constructable<unknown>,
      multiple: false,
      eager: false
    })
  }
}
