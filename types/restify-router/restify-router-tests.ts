// tslint:disable file-name-casing

import { Server, createServer, Request, Response, Next } from 'restify';
import { Router } from 'restify-router';

const instance1 = new Router();
const instance2 = new Router();

const restifyServer1: Server = createServer({});

instance1.add('/a', instance2);
instance2.add('/a', instance1);

instance1.applyRoutes(restifyServer1, 'prefix1');

instance1.get('/foo-get', (req: Request, res: Response, next: Next) => { res.send(200); });
instance1.post('/foo-post', (req: Request, res: Response, next: Next) => { res.send(200); });
instance1.put('/foo-put', (req: Request, res: Response, next: Next) => { res.send(200); });
instance1.del('/foo-del', (req: Request, res: Response, next: Next) => { res.send(200); });
instance1.patch('/foo-patch', (req: Request, res: Response, next: Next) => { res.send(200); });
instance1.head('/foo-head', (req: Request, res: Response, next: Next) => { res.send(200); });
instance1.opts('/foo-opts', (req: Request, res: Response, next: Next) => { res.send(200); });
