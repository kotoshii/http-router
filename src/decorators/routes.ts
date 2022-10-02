import { HttpMethods } from '../constants/httpMethods'
import { createRouteDecorator } from '../utils/createRouteDecorator'

export const Delete = createRouteDecorator(HttpMethods.DELETE)
export const Get = createRouteDecorator(HttpMethods.GET)
export const Head = createRouteDecorator(HttpMethods.HEAD)
export const Patch = createRouteDecorator(HttpMethods.PATCH)
export const Post = createRouteDecorator(HttpMethods.POST)
export const Put = createRouteDecorator(HttpMethods.PUT)
