CREATE DATABASE monitoramento;

\c monitoramento;

CREATE TABLE vazamentos (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  title TEXT,
  domain TEXT,
  breach_date DATE,
  added_date TIMESTAMP,
  pwn_count INTEGER,
  description TEXT,
  data_classes TEXT[],
  notified BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
