CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS history;

DROP TABLE IF EXISTS users;

DROP TYPE IF EXISTS currency_codes;

CREATE TYPE currency_codes AS ENUM ('USD', 'EUR', 'GBP');

CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT DEFAULT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (timezone('utc', now())) NOT NULL,
  last_login TIMESTAMP WITHOUT TIME ZONE DEFAULT (timezone('utc', now())) NOT NULL,
  default_currency currency_codes DEFAULT 'USD'
);


CREATE TABLE history (
  pk SERIAL PRIMARY KEY,
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  user_fk TEXT NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (timezone('utc', now())) NOT NULL,
  currency_code currency_codes NOT NULL,
  drawer_amount INT NOT NULL,
  denominations TEXT NOT NULL,
  note VARCHAR(200),
  history_color INT NOT NULL,

  CONSTRAINT fk_users 
    FOREIGN KEY(user_fk) 
      REFERENCES users(username) 
        ON DELETE CASCADE
);