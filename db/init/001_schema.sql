CREATE TABLE clients (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  inn        VARCHAR(12) UNIQUE NOT NULL,
  email      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE invoices (
  id         SERIAL PRIMARY KEY,
  client_id  INT NOT NULL REFERENCES clients(id),
  number     TEXT UNIQUE NOT NULL,
  currency   CHAR(3) NOT NULL DEFAULT 'RUB',
  status     TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','issued','paid')),
  issued_at  DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE invoice_items (
  id          SERIAL PRIMARY KEY,
  invoice_id  INT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity    NUMERIC(12,3) NOT NULL CHECK (quantity > 0),
  unit_price  NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0)
);

INSERT INTO clients (name, inn, email) VALUES
  ('ООО Ромашка', '7701234567', 'info@romashka.test'),
  ('ИП Петров', '165012345678', 'petrov@test.test');