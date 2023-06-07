CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS history;

DROP TABLE IF EXISTS users;

CREATE TABLE users(
  id serial PRIMARY KEY,
  username varchar(30) UNIQUE NOT NULL,
  password TEXT DEFAULT NULL,
  created_at timestamptz DEFAULT (now()) NOT NULL,
  last_login timestamptz DEFAULT (now()) NOT NULL,
  currency varchar(3) DEFAULT 'USD' NOT NULL,
  amount int DEFAULT 10000
);

CREATE TABLE history(
  pk serial PRIMARY KEY,
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  user_id integer REFERENCES users ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT (now()) NOT NULL,
  currency_code varchar(3) NOT NULL,
  drawer_amount int NOT NULL,
  denominations text NOT NULL,
  note varchar(200),
  history_color int NOT NULL
);

