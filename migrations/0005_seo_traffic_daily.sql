CREATE TABLE IF NOT EXISTS seo_traffic_daily (
  day TEXT NOT NULL,
  dimension TEXT NOT NULL,
  name TEXT NOT NULL,
  hits INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, dimension, name)
);
