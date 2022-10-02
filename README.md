# nanoroutes
Simple decorator-based routing library, created on top of [http](https://nodejs.org/api/http.html) module.
Supports most commonly used (if not all) HTTP verbs, async middlewares and Dependency Injection via [typedi](https://www.npmjs.com/package/typedi).

# Instalation
**[nanoroutes](https://www.npmjs.com/package/nanoroutes)** was developed using Node.js version **16.15**. But, although it wasn't tested on older versions, it should work on other versions as well.

To install run

`npm install nanoroutes` or `yarn add nanoroutes`

# Usage
```typescript
import { Controller, Get, createServer, Post, Request, MiddlewareFunction } from 'nanoroutes'

const controllerMiddleware: MiddlewareFunction = (req, res, next) => {
  console.log('controller middleware 1')
  next()
}

const routeMiddlewares: MiddlewareFunction[] = [
  async (req, res, next) => {
    console.log('route middleware 1')
    next()
  },
  (req, res, next) => {
    console.log('route middleware 2')
    next()
  }
]

const globalMiddlewares = [
  async (req, res, next) => {
    console.log('global middleware 1')
    next()
  },
  async (req, res, next) => {
    console.log('global middleware 2')
    next()
  }
]

@Controller('/api', [controllerMiddleware])
class TestController {
  @Get('/error')
  async error() {
    throw new Error('some error')
  }

  @Get('/info')
  async getInfo() {
    return 'some info'
  }

  @Post('/body', routeMiddlewares)
  async getBody(req: Request) {
    return req.body
  }
}

const server = createServer()
server
  .useMiddleware(...globalMiddlewares)
  .listen(8000, () => console.log('started'))
```

