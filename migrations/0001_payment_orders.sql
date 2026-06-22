CREATE TABLE IF NOT EXISTS payment_orders (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  status TEXT NOT NULL,
  payment_status TEXT,
  price_cents INTEGER NOT NULL,
  currency TEXT NOT NULL,
  email TEXT NOT NULL,
  arrival_date TEXT NOT NULL,
  flight_number TEXT NOT NULL,
  passenger_count INTEGER NOT NULL,
  child_passenger_count INTEGER NOT NULL,
  infant_passenger_count INTEGER NOT NULL,
  passport_object_key TEXT,
  passport_file_name TEXT,
  passport_content_type TEXT,
  passport_size INTEGER,
  selfie_object_key TEXT,
  selfie_file_name TEXT,
  selfie_content_type TEXT,
  selfie_size INTEGER,
  prodamus_payment_url TEXT,
  provider_order_id TEXT,
  last_return_status TEXT,
  webhook_verified INTEGER NOT NULL DEFAULT 0,
  raw_return_payload TEXT,
  raw_webhook_payload TEXT
);

CREATE INDEX IF NOT EXISTS idx_payment_orders_email ON payment_orders(email);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON payment_orders(status);
CREATE INDEX IF NOT EXISTS idx_payment_orders_created_at ON payment_orders(created_at);

CREATE TABLE IF NOT EXISTS payment_events (
  id TEXT PRIMARY KEY,
  order_id TEXT,
  event_type TEXT NOT NULL,
  status TEXT,
  verified INTEGER NOT NULL DEFAULT 0,
  payload TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES payment_orders(id)
);

CREATE INDEX IF NOT EXISTS idx_payment_events_order_id ON payment_events(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_created_at ON payment_events(created_at);
