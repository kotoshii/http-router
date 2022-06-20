import { Controller, Get, createServer } from '../src'

@Controller()
// eslint-disable-next-line no-unused-vars
class TestController {
  @Get('/')
  home() {
    return 'homepage'
  }

  @Get('/info')
  getInfo() {
    return 'some info lololo'
  }
}

const server = createServer()
server.listen(8000, () => console.log('started'))
