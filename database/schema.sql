CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL CHECK (name IN ('ADMIN','STAFF','CUSTOMER'))
);
INSERT INTO roles(name) VALUES ('ADMIN'),('STAFF'),('CUSTOMER') ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  code VARCHAR(80) UNIQUE NOT NULL,
  description TEXT
);
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY(role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role_id INTEGER NOT NULL REFERENCES roles(id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(160) NOT NULL,
  type VARCHAR(30) NOT NULL DEFAULT 'SERVICE' CHECK (type IN ('SERVICE','GOODS')),
  sales_price NUMERIC(12,2) NOT NULL CHECK (sales_price >= 0),
  cost_price NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (cost_price >= 0),
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  name VARCHAR(120) NOT NULL,
  price_adjustment NUMERIC(12,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(product_id, name)
);

CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(160) NOT NULL,
  description TEXT,
  billing_interval VARCHAR(20) NOT NULL CHECK (billing_interval IN ('DAILY','WEEKLY','MONTHLY','YEARLY')),
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  min_quantity INTEGER NOT NULL DEFAULT 1 CHECK (min_quantity > 0),
  available_from DATE,
  available_until DATE,
  auto_close BOOLEAN NOT NULL DEFAULT FALSE,
  allow_pause BOOLEAN NOT NULL DEFAULT TRUE,
  allow_renewal BOOLEAN NOT NULL DEFAULT TRUE,
  allow_early_close BOOLEAN NOT NULL DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tax_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  rate NUMERIC(7,4) NOT NULL CHECK (rate >= 0 AND rate <= 100),
  is_inclusive BOOLEAN NOT NULL DEFAULT FALSE,
  product_id UUID REFERENCES products(id),
  starts_at DATE,
  ends_at DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS discount_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('FIXED','PERCENTAGE')),
  value NUMERIC(12,2) NOT NULL CHECK (value >= 0),
  min_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  product_id UUID REFERENCES products(id),
  starts_at DATE,
  ends_at DATE,
  usage_limit INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_number VARCHAR(40) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES users(id),
  plan_id UUID NOT NULL REFERENCES plans(id),
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','QUOTATION','CONFIRMED','ACTIVE','PAUSED','CLOSED')),
  start_date DATE NOT NULL,
  expiry_date DATE,
  next_billing_date DATE,
  payment_terms_days INTEGER NOT NULL DEFAULT 7,
  discount_rule_id UUID REFERENCES discount_rules(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer ON subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE TABLE IF NOT EXISTS subscription_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0)
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(40) UNIQUE NOT NULL,
  subscription_id UUID NOT NULL REFERENCES subscriptions(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL,
  discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL,
  amount_paid NUMERIC(12,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'UNPAID' CHECK (status IN ('UNPAID','PARTIAL','PAID','CANCELLED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(subscription_id, period_start)
);
CREATE INDEX IF NOT EXISTS idx_invoices_due ON invoices(due_date, status);
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  description VARCHAR(200) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  line_subtotal NUMERIC(12,2) NOT NULL,
  tax_rate NUMERIC(7,4) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  line_total NUMERIC(12,2) NOT NULL
);
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id),
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  method VARCHAR(30) NOT NULL CHECK (method IN ('CASH','CARD','BANK_TRANSFER','UPI','OTHER')),
  reference VARCHAR(120),
  note TEXT,
  payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  received_by UUID REFERENCES users(id)
);

INSERT INTO permissions(code,description) VALUES
('products.manage','Create and manage products'),('plans.manage','Create and manage plans'),
('taxes.manage','Manage tax rules'),('discounts.manage','Manage discount rules'),
('subscriptions.manage','Manage subscriptions'),('invoices.manage','Generate and manage invoices'),
('payments.manage','Record payments'),('reports.view','View reports'),('users.manage','Manage staff and customers')
ON CONFLICT(code) DO NOTHING;
INSERT INTO role_permissions(role_id,permission_id)
SELECT r.id,p.id FROM roles r CROSS JOIN permissions p WHERE r.name='ADMIN'
ON CONFLICT DO NOTHING;

-- Per-user permissions allow different staff members to have different access.
CREATE TABLE IF NOT EXISTS user_permissions (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY(user_id, permission_id)
);
