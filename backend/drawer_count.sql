
\echo 'Delete and recreate drawer_count db?' 
\prompt 'Return for yes or control-C to cancel > ' foo 

DROP DATABASE drawer_count;

CREATE DATABASE drawer_count;

\c drawer_count 

\i schema.sql 


\echo 'Seed database?' 
\prompt 'Y/N > ' seed
SELECT ('y' = LOWER(:'seed')) AS seeding \gset 
\if :seeding
  \i seed.sql 
  \echo 'Database seeded'
\endif

\echo 'Delete and recreate drawer_count_test db?' 
\prompt 'Return for yes or control-C to cancel > ' foo


DROP DATABASE drawer_count_test;

CREATE DATABASE drawer_count_test;

\c drawer_count_test

\i schema.sql
\i seed.sql