INSERT INTO users (username, password)
VALUES (
    'user1',
    '$2b$12$.TeoOuwTORlz.d7cdYjPoOmFDAlN5t7HCdCoORL5AZpIHOdoTiDMi'
  ),
  ('user2', NULL);

INSERT INTO history (
    user_fk,
    currency_code,
    denominations,
    drawer_amount,
    note,
    history_color
  )
VALUES (
    'user1',
    'USD',
    '[4,2,10,7,2,17,15,21,10,30]',
    100,
    NULL,
    105
  ),
  (
    'user1',
    'GBP',
    '[5,3,10,7,2,16,15,20,10,30]',
    200,
    'User1 Second Submit',
    105
  ),
  (
    'user2',
    'EUR',
    '[5,3,10,7,2,16,15,20,10,30]',
    200,
    NULL,
    120
  )