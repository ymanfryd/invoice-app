import type { Middleware } from 'koa';

const errorHandler: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    console.error(e);
    ctx.status = 500;
    ctx.body = { error: 'Internal error' };
  }
};

export default errorHandler;
