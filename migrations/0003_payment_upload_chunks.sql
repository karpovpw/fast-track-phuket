CREATE TABLE IF NOT EXISTS payment_uploads (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  field TEXT NOT NULL,
  file_name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  chunk_count INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES payment_orders(id)
);

CREATE INDEX IF NOT EXISTS idx_payment_uploads_order_id ON payment_uploads(order_id);

CREATE TABLE IF NOT EXISTS payment_upload_chunks (
  upload_id TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  data_base64 TEXT NOT NULL,
  PRIMARY KEY (upload_id, chunk_index),
  FOREIGN KEY (upload_id) REFERENCES payment_uploads(id)
);
