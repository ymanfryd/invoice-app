import Router from '@koa/router';
import { pool } from '../db.js';

const router = new Router({ prefix: '/invoices' });

router.get('/', async (ctx) => {
  const limit = Math.min(Number(ctx.query.limit) || 20, 100);
  const offset = Number(ctx.query.offset) || 0;

  const result = await pool.query(
    `SELECT id, client_id, number, currency, status, issued_at, created_at
     FROM invoices
     ORDER BY id
     LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
  ctx.body = result.rows;
});

export default router;
