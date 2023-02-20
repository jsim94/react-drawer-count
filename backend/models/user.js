"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
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

  /** Updates the password of a user
   *
   * Returns { username, first_name, last_name, is_admin, jobs }
   *   where jobs is { id, title, company_handle, company_name, state }
   *
   * Throws BadRequestError if no password is provided
   * Throws NotFoundError if user not found.
   *
   **/

  static async changePassword(username, newPassword) {
    if (!newPassword)
      throw new BadRequestError("newPassword cannot be ", newPassword);

    const hashedPassword = await bcrypt.hash(
      newPassword,
      BCRYPT_WORK_FACTOR
    );

    const { setCols, values } = sqlForPartialUpdate({
      password: hashedPassword,
    });

    const usernameVarIdx = "$" + (values.length + 1);
    const queryString = `UPDATE users
                          SET ${setCols}
                          WHERE username = ${usernameVarIdx}
                          RETURNING username`;

    const result = await db.query(queryString, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
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
