import Router from '@koa/router';
import { z } from 'zod';
import { pool } from '../db.js';

const router = new Router({ prefix: '/clients' });

const clientSchema = z.object({
  name: z.string().min(1),
  inn: z.string().regex(/^(\d{10}|\d{12})$/, 'ИНН: 10 или 12 цифр'),
  email: z.email().optional(),
});

router.get('/', async (ctx) => {
  const result = await pool.query(`SELECT id, name, inn, email 
    FROM clients ORDER BY id`);
  ctx.body = result.rows;
});

router.post('/', async (ctx) => {
  const parsed = clientSchema.safeParse(ctx.request.body);
  if (!parsed.success) {
    ctx.status = 400;
    ctx.body = { error: 'Validation failed', details: parsed.error.issues };
    return;
  }

  const { name, inn, email } = parsed.data;
  try {
    const result = await pool.query(
      `INSERT INTO clients (name, inn, email) 
      VALUES ($1, $2, $3) RETURNING id, name, inn, email`,
      [name, inn, email ?? null],
    );
    ctx.status = 201;
    ctx.body = result.rows[0];
  } catch (e) {
    if (typeof e === 'object' && e !== null && 'code' in e && e.code === '23505') {
      ctx.status = 409;
      ctx.body = { error: 'Client with this INN already exists' };
      return;
    }
    throw e;
  }
});

export default router;
