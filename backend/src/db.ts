import pg from 'pg';

pg.types.setTypeParser(1082, (value) => value);

export const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  user: 'app',
  password: 'app',
  database: 'invoices',
});
