"use strict";

const db = require("../db");
const User = require("./user");
const { sqlForPartialUpdate } = require("../helpers/sql");
const currencyJson = require("../currency.json");

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

/** Related functions for submission history . */

class History {
  static getSchema(schemaName) {
    const schema = currencyJson.currencies[schemaName];
    if (schema === undefined)
      throw new NotFoundError(`Currency code ${schemaName} not found`);
    return schema;
  }

  /** Returns a submission by ID
   *
   *  Returns {
   *    id,
   *    created_at,
   *    currencyCode,
   *    denominations,
   *    note,
   *    historyColor
   *  }
   *
   **/
  static async getById(id) {
    const res = await db.query(
      `SELECT h.id,
              u.username,
              h.created_at AS "createdAt",
              drawer_amount AS "drawerAmount",
              currency_code AS "currencyCode",
              denominations,
              note,
              history_color AS "historyColor"
        FROM history h
          JOIN users u
            ON u.id = h.user_id
        WHERE h.id = $1`,
      [id]
    );

    const submission = res.rows[0];

    if (!submission) throw new NotFoundError(`No submission with id: ${id}`);

    submission.denominations = JSON.parse(submission.denominations);
    return submission;
  }

  /** Returns all history for a user
   *
   *  Returns [{
   *    id,
   *    createdAt,
   *    historyColor
   * }]
   *
   **/
  static async getUserHistory(username) {
    const res = await db.query(
      `SELECT h.id,
              h.created_at AS "createdAt",
              h.history_color AS "historyColor"
        FROM history h
          JOIN users u ON u.id = user_id
        WHERE u.username=$1
        ORDER BY h.created_at DESC`,
      [username]
    );
    // if (res.rows.length === 0)
    //   throw new NotFoundError("No results found for user: ", username);

    return res.rows;
  }

  /** Adds a transaction to the history table
   *
   * @param {string} username username
   * @param {object} data
   *  @param {string} data.currencyCode
   *  @param {string} data.denominations
   *  @param {string} data.drawerAmount
   *  @param {string} data.note
   *
   *  Returns {
   *    id,
   *    username,
   *    created_at,
   *    currencyCode,
   *    denominations,
   *    note,
   *    historyColor
   *  }
   *
   **/
  static async create(username, data) {
    const user = await User.get(username, true);

    const values = [
      user.id,
      data.currencyCode,
      data.drawerAmount,
      JSON.stringify(data.denominations),
      data.note || null,
      Math.floor(Math.random() * 24) * 15, // random HSL hue for color saving
    ];

    const res = await db.query(
      `INSERT INTO history (
          user_id,
          currency_code,
          drawer_amount,
          denominations,
          note,
          history_color
        )
        VALUES ($1,$2,$3, $4, $5, $6)
        RETURNING 
          id, 
          created_at AS "createdAt",
          currency_code AS "currencyCode",
          drawer_amount AS "drawerAmount",
          denominations,
          note,
          history_color AS "historyColor"`,
      values
    );

    const submission = res.rows[0];

    submission.denominations = JSON.parse(submission.denominations);
    return submission;
  }

  /** Updates a submission with a note
   *
   *  Returns {
   *    id,
   *    username,
   *    created_at,
   *    currencyCode,
   *    denominations,
   *    note,
   *    historyColor
   *  }
   **/
  static async addNote(id, note) {
    const { setCols, values } = sqlForPartialUpdate({ note });

    const idIndex = "$" + (values.length + 1);
    const queryString = `UPDATE history
                          SET ${setCols}
                          WHERE id = ${idIndex}
                          RETURNING 
                            id, 
                            created_at as "createdAt", 
                            currency_code AS "currencyCode",
                            drawer_amount AS "drawerAmount",
                            denominations,
                            note,
                            history_color AS "historyColor"`;

    const res = await db.query(queryString, [...values, id]);
    const submission = res.rows[0];

    if (!submission) throw new NotFoundError(`No submission with id: ${id}`);

    submission.denominations = JSON.parse(submission.denominations);
    return submission;
  }

  /** Deletes a single transaction by ID
   *
   **/
  static async delete(id) {
    let result = await db.query(
      `DELETE
        FROM history
        WHERE id = $1
        RETURNING id`,
      [id]
    );
    const submission = result.rows[0];

    if (!submission) throw new NotFoundError(`No submission with id: ${id}`);

    return { message: "success" };
  }

  /** Deletes all transactions by a user
   *
   **/
  static async deleteUserHistory(username) {
    let result = await db.query(
      `DELETE 
        FROM history h
          USING users u
        WHERE u.username = $1
        RETURNING h.id`,
      [username]
    );
    const submissions = result.rows;

    return { message: "success" };
  }
}

module.exports = History;
