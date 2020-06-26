// tslint:disable file-name-casing

import { Server, createServer, Request, Response, Next } from 'restify'
import { Router } from 'restify-router'

const router = new Router()
const restifyServer1: Server = createServer({})

router.get('/', (req: Request, res: Response, next: Next) => { res.send(200); });

router.group('/a', function (router: Router) {
    router.get('/foo-get', (req: Request, res: Response, next: Next) => { res.send(200); });
    router.post('/foo-post', (req: Request, res: Response, next: Next) => { res.send(200); });
    router.put('/foo-put', (req: Request, res: Response, next: Next) => { res.send(200); });
    router.del('/foo-del', (req: Request, res: Response, next: Next) => { res.send(200); });
    router.patch('/foo-patch', (req: Request, res: Response, next: Next) => { res.send(200); });
    router.head('/foo-head', (req: Request, res: Response, next: Next) => { res.send(200); });
    router.opts('/foo-opts', (req: Request, res: Response, next: Next) => { res.send(200); });
})

router.applyRoutes(restifyServer1, 'prefix1');


