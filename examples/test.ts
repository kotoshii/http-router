/* eslint-disable no-unused-vars */
import { Controller, Get, createServer, Post } from '../src'
import { Request } from '../src/types/Request'

@Controller('/', [
  (req, res, next) => {
    console.log('controller middleware 1')
    next()
  }
])
class TestController {
  @Get('/error')
  async home() {
    throw new Error('some error')
  }

  @Post('/info', [
    async (req, res, next) => {
      console.log('route middleware 1')
      next()
    },
    (req, res, next) => {
      console.log('route middleware 2')
      next()
    }
  ])
  async getInfo(req: Request) {
    return req.body
  }
}

const server = createServer()
server.useMiddleware(
  async (req, res, next) => {
    console.log('global middleware 1')
    next()
  },
  async (req, res, next) => {
    console.log('global middleware 2')
    next()
  }
).listen(8000, () => console.log('started'))
