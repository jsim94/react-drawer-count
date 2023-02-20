# Drawer Count API

Backend for Drawer Count application providing user authentication, submission calculations, and history submission and retrieval.

---

### Authentication

<details>
 <summary><code>POST</code> <code><b>/auth/token</b></code> authenticates user and returns auth token</summary>

##### Parameters

> | name       | type     | data type | description                             |
> | ---------- | -------- | --------- | --------------------------------------- |
> | `username` | required | string    | username                                |
> | `password` | optional | string    | password (not all users have passwords) |

##### Responses

> | http code | content-type       | response                                    |
> | --------- | ------------------ | ------------------------------------------- |
> | `201`     | `application/json` | `{ "token": <authToken> }`                  |
> | `401`     | `application/json` | `{ "error": "Invalid username/password" } ` |

</details>

<details>
 <summary><code>POST</code> <code><b>/auth/register</b></code> creates a new user</summary>

##### Parameters

> | name       | type     | data type | description                             |
> | ---------- | -------- | --------- | --------------------------------------- |
> | `username` | required | string    | username                                |
> | `password` | optional | string    | password (not all users have passwords) |

##### Responses

> | http code | content-type       | response                                         |
> | --------- | ------------------ | ------------------------------------------------ |
> | `201`     | `application/json` | `{ "token": <authToken> }`                       |
> | `401`     | `application/json` | `{ "error": "Invalid username/password" } `      |
> | `400`     | `application/json` | `{ "error": "Duplicate username: <username>" } ` |

</details>

---

### History

<details><summary>Example of standard history response object: </summary>

```json
{
  "currencyCode": "USD",
  "drawerAmount": 100,
  "symbol": "$",
  "values": [
    {
      "name": "$100",
      "value": 100
    },
    {
      "name": "$50",
      "value": 50
    },
    {
      "name": "$20",
      "value": 20
    },
    {
      "name": "$10",
      "value": 10
    },
    {
      "name": "$5",
      "value": 5
    },
    {
      "name": "$1",
      "value": 1
    },
    {
      "name": "Quarters",
      "value": 0.25
    },
    {
      "name": "Dimes",
      "value": 0.1
    },
    {
      "name": "Nickels",
      "value": 0.05
    },
    {
      "name": "Pennies",
      "value": 0.01
    }
  ],
  "total": 732.16,
  "depositValues": {
    "denominations": [3, 1, 10, 8, 0, 2, 0, 1, 0, 1],
    "changeTotal": 0.11,
    "total": 632.11
  },
  "drawerValues": {
    "denominations": [0, 0, 0, 7, 5, 0, 17, 8, 0, 0],
    "changeTotal": 5.05,
    "total": 100.05
  }
}
```

</details>

---

<details>
 <summary><code>POST</code> <code><b>/history/submit</b></code> creates a new history entry and returns a standard history JSON object</summary>

##### Parameters

> | name            | type     | data type | description                                                            |
> | --------------- | -------- | --------- | ---------------------------------------------------------------------- |
> | `currencyCode`  | required | string    | Currency code to be used                                               |
> | `drawerAmount`  | required | number    | Amount to be left in cash drawer                                       |
> | `denominations` | required | string    | Stringified JSON array of denomination quantities, largest to smallest |

##### Responses

> | http code | content-type       | response                       |
> | --------- | ------------------ | ------------------------------ |
> | `201`     | `application/json` | `Standard JSON history object` |

</details>

<details>
 <summary><code>GET</code> <code><b>/history/:id</b></code> returns a single submission by ID</summary>

##### Parameters

> None

##### Responses

> | http code | content-type       | response                                     |
> | --------- | ------------------ | -------------------------------------------- |
> | `200`     | `application/json` | `Standard JSON history object`               |
> | `404`     | `application/json` | `{ "error": "No submission with id: <id>" }` |

</details>

<details>
 <summary><code>GET</code> <code><b>/history/user/:username</b></code> returns list of submissions by username</summary>

##### Parameters

> None

##### Responses

> | http code | content-type       | response                                                |
> | --------- | ------------------ | ------------------------------------------------------- |
> | `200`     | `application/json` | `[ {id, createdAt, historyColor},...]`                  |
> | `404`     | `application/json` | `{ "error": "No results found for user: <username>" } ` |

</details>

<details>
 <summary><code>PUT</code> <code><b>/history/:id/add-note</b></code> adds a note to a submission and returns standard JSON history object</summary>

##### Parameters

> | name   | type     | data type | description                           |
> | ------ | -------- | --------- | ------------------------------------- |
> | `note` | required | string    | note must be less than 250 characters |

##### Responses

> | http code | content-type       | response                                      |
> | --------- | ------------------ | --------------------------------------------- |
> | `200`     | `application/json` | `[ {id, createdAt, historyColor},...]`        |
> | `404`     | `application/json` | `{ "error": "No submission with id: <id>" } ` |

</details>

<details>
 <summary><code>DELETE</code> <code><b>/history/:id/delete</b></code> deletes a submission by id</summary>

##### Parameters

> None

##### Responses

> | http code | content-type       | response                                      |
> | --------- | ------------------ | --------------------------------------------- |
> | `200`     | `application/json` | `{ "message": "success" }`                    |
> | `404`     | `application/json` | `{ "error": "No submission with id: <id>" } ` |

</details>

<details>
 <summary><code>DELETE</code> <code><b>/history/user/:username/delete-history</b></code> deletes all submissions by username</summary>

##### Parameters

> None

##### Responses

> | http code | content-type       | response                                                |
> | --------- | ------------------ | ------------------------------------------------------- |
> | `200`     | `application/json` | `{ "message": "success" }`                              |
> | `404`     | `application/json` | `{ "error": "No results found for user: <username>" } ` |

</details>
