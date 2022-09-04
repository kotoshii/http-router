import { Controller, Get, createServer } from '../src'
import { Request } from '../src/types/Request'
import { Response } from '../src/types/Response'

@Controller()
// eslint-disable-next-line no-unused-vars
class TestController {
  @Get('/stores/:storeId/users/:userId')
  async home(req: Request, res: Response) {
    console.log(req.params)
    return 'homepage'
  }

  @Get('/info')
  async getInfo(req: Request, res: Response) {
    console.log(req.query)
    return 'some info lololo'
  }
}

const server = createServer()
server.listen(8000, () => console.log('started'))
