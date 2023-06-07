"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config");
const currencyJson = require("../currency.json");

/** Related functions for users. */

class User {
  /** Check if user exists
   *
   * Returns if found
   *
   **/
  static async checkUser(username) {
    const result = await db.query(
      `SELECT username, 
                CASE 
                  WHEN "password" IS NULL THEN 0::boolean ELSE 1::boolean  
                    END "password"
        FROM users
        WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    return {
      found: !!user,
      password: (user && user.password) || false,
    };
  }

  /** authenticate user with username, password.
   *
   * Returns { username }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   *
   **/
  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT username,
              password
        FROM users
        WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      let isValid = false;

      if (user.password === null) {
        isValid = true;
      } else {
        if (password !== null)
          isValid = await bcrypt.compare(password, user.password);
      }

      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username }
   *
   * Throws BadRequestError on duplicates.
   *
   **/
  static async register({ username, password }) {
    const duplicateCheck = await db.query(
      `SELECT username
           FROM users
           WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, BCRYPT_WORK_FACTOR)
      : null;

    const res = await db.query(
      `INSERT INTO users (
          username,
          password
        )
        VALUES ($1, $2)
        RETURNING username;`,
      [username, hashedPassword]
    );

    const user = res.rows[0];

    return user;
  }

  /** Given a username, return data about user.
   *
   * Returns { username, password(bool), defaultCurrency, defaultAmount }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(username, requireId) {
    const userRes = await db.query(
      `SELECT     ${requireId ? "id," : ""}
                  username,
                  currency,
                  amount,
                  CASE 
                    WHEN password IS NULL THEN 0::boolean ELSE 1::boolean  
                    END password
           FROM users
           WHERE username = $1`,
      [username]
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  /** Updates user
   *
   * Returns { username, password(bool), defaultCurrency, defaultAmount }
   *
   * Throws BadRequestError if no password is provided
   * Throws NotFoundError if user not found.
   *
   **/
  static async update(username, data) {
    if (data === undefined)
      throw new BadRequestError('Argument "data" must be defined');
    if (
      data.currency &&
      !Object.keys(currencyJson.currencies).includes(data.currency)
    )
      throw new BadRequestError("Invalid currency code");

    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(data);
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                currency,
                                amount,
                                CASE 
                                  WHEN password IS NULL THEN 0::boolean ELSE 1::boolean  
                                  END password`;

    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
      `DELETE
        FROM users
        WHERE username = $1
        RETURNING username`,
      [username]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }
}

module.exports = User;
