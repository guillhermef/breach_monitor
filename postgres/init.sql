CREATE DATABASE monitoramento;

CREATE TABLE monitoramento_ssl (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE,
  title TEXT,
  domain TEXT,
  breach_date DATE,
  added_date TIMESTAMP,
  pwn_count INTEGER,
  description TEXT,
  data_classes TEXT[],
  notified,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
