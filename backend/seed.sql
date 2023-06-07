INSERT INTO users (username, password)
VALUES (
    'user1',
    '$2b$12$.TeoOuwTORlz.d7cdYjPoOmFDAlN5t7HCdCoORL5AZpIHOdoTiDMi'
  ),
  ('user2', NULL),
  ('test1234', '$2b$12$929QrYdqXw1kz0VFG852GupYqEmD8f0xaRn9/DcvztQJ0hBZpBt.S');

INSERT INTO history (
    user_id,
    currency_code,
    denominations,
    drawer_amount,
    note,
    history_color
  )
VALUES (
    1,
    'USD',
    '[4,2,10,7,2,17,15,21,10,30]',
    10000,
    NULL,
    105
  ),
  (
    1,
    'GBP',
    '[5,3,10,7,2,16,15,20,10,30]',
    20000,
    'User1 Second Submit',
    105
  ),
  (
    2,
    'EUR',
    '[5,3,10,7,2,16,15,20,10,30]',
    20000,
    NULL,
    120
  ),
  (
    3,
    'USD',
    '[5,3,10,7,2,16,15,20,10,30]',
    10000,
    NULL,
    120
  ),
  (
    3,
    'USD',
    '[5,3,10,7,2,16,15,20,10,30]',
    20000,
    NULL,
    60
  );