import Router from '@koa/router';
import { pool } from '../db.js';
import { z } from 'zod';

const router = new Router({ prefix: '/invoices' });

const invoiceSchema = z.object({
  client_id: z.number().int().positive(),
  number: z.string().min(1),
  currency: z.string().length(3).default('RUB'),
  status: z.enum(['draft', 'issued', 'paid']).default('draft'),
  issued_at: z.iso.date().optional(),
  items: z
    .array(
      z.object({
        description: z.string().min(1),
        quantity: z.number().positive(),
        unit_price: z.number().nonnegative(),
      }),
    )
    .min(1),
});
const idSchema = z.coerce.number().int().positive();

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

router.get('/:id', async (ctx) => {
  const parsedId = idSchema.safeParse(ctx.params.id);
    if (!parsedId.success) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid invoice id' };
    return;
  }
  const id = parsedId.data;

  const header = await pool.query(
    `SELECT i.id, i.number, i.currency, i.status, i.issued_at, i.created_at,
            c.id AS client_id, c.name AS client_name, c.inn AS client_inn,
            ROUND(COALESCE(SUM(it.quantity * it.unit_price), 0), 2) AS total
     FROM invoices i
     JOIN clients c ON c.id = i.client_id
     LEFT JOIN invoice_items it ON it.invoice_id = i.id
     WHERE i.id = $1
     GROUP BY i.id, c.id`,
    [id],
  );
   if (header.rows.length === 0) {
    ctx.status = 404;
    ctx.body = { error: 'Invoice not found' };
    return;
  }

  const items = await pool.query(
    `SELECT id, description, quantity, unit_price
     FROM invoice_items
     WHERE invoice_id = $1
     ORDER BY id`,
    [id],
  );

  ctx.body = { ...header.rows[0], items: items.rows };
});

router.post('/', async (ctx) => {
  const parsed = invoiceSchema.safeParse(ctx.request.body);
  if (!parsed.success) {
    ctx.status = 400;
    ctx.body = { error: 'Validation failed', details: parsed.error.issues };
    return;
  }
  const { client_id, number, currency, status, issued_at, items } = parsed.data;

  const db = await pool.connect();
  try {
    await db.query('BEGIN');
    const invoice = await db.query(
      `INSERT INTO invoices (client_id, number, currency, status, issued_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, client_id, number, currency, status, issued_at, created_at`,
      [client_id, number, currency, status, issued_at ?? null],
    );
    const invoiceId = invoice.rows[0].id;

    for (const item of items) {
      await db.query(
        `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [invoiceId, item.description, item.quantity, item.unit_price],
      );
    }
    await db.query('COMMIT');

    ctx.status = 201;
    ctx.body = { ...invoice.rows[0], items };
  } catch (e) {
    await db.query('ROLLBACK');
    if (typeof e === 'object' && e !== null && 'code' in e) {
      if (e.code === '23505') {
        ctx.status = 409;
        ctx.body = { error: 'Invoice number already exists' };
        return;
      }
      if (e.code === '23503') {
        ctx.status = 422;
        ctx.body = { error: 'Client not found' };
        return;
      }
    }
    throw e;
  } finally {
    db.release();
  }
});

export default router;
