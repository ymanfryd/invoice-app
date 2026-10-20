import Koa from 'koa';
import { bodyParser } from '@koa/bodyparser';
import clientsRouter from './routes/clients.js';
import invoicesRouter from './routes/invoices.js';
import logger from './middleware/logger.js';
import errorHandler from './middleware/errorHandler.js';

export const app = new Koa();

app.use(logger);
app.use(errorHandler);
app.use(bodyParser());
app.use(clientsRouter.routes()).use(clientsRouter.allowedMethods());
app.use(invoicesRouter.routes()).use(invoicesRouter.allowedMethods());

export default app;
