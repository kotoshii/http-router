import { MetadataStorage } from '../metadata/MetadataStorage/MetadataStorage'
import { Constructable, Container } from 'typedi'

export const Controller = (basePath?: string): ClassDecorator => {
  const metadataStorage = Container.get(MetadataStorage)

  return (target) => {
    metadataStorage.addControllerMetadata(basePath || '', target)
    Container.set({
      id: target,
      type: target as unknown as Constructable<unknown>,
      multiple: false,
      eager: false
    })
  }
}
