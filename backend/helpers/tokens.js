const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** Returns a signed JWT from user data
 *
 * @param {object} user user object
 * @returns
 */

function createToken(user) {
  let payload = {
    username: user.username,
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
