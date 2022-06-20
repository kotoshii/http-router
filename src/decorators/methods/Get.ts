import { MetadataStorage } from '../../metadata/MetadataStorage/MetadataStorage'
import { Container } from 'typedi'

export const Get = (route?: string): MethodDecorator => {
  const metadataStorage = Container.get(MetadataStorage)

  return (target, propertyKey) => {
    metadataStorage.addActionMetadata(route || '', 'GET', target, propertyKey as string)
  }
}
