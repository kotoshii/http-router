/* eslint-disable no-unused-vars */
import { Controller, Get, createServer } from '../src'

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

  @Get('/info', [
    async (req, res, next) => {
      console.log('route middleware 1')
      next()
    },
    (req, res, next) => {
      console.log('route middleware 2')
      next()
    }
  ])
  async getInfo() {
    return 'some info lololo'
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
