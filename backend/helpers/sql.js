const { BadRequestError } = require("../expressError");

/** Generates a SQL "WHERE" string from passed 'where'-clause string array
 *
 *  @param {array<String>} paramStrings strings to add to WHERE statement
 *
 *  @returns {string} WHERE string to insert into sql query, or undefined
 *
 **/

function sqlForWhereString(paramStrings) {
  let whereString = "";
  if (whereKeys.length > 0) {
    whereString = "WHERE ";

    paramStrings.forEach((string, idx) => {
      if (idx !== 0) whereString += " AND ";

      whereString += string;
    });
  }
  return whereString;
}

/** Generates a SQL "Set" string and array of values.
 *
 *  @param {object} dataToUpdate keys/values to update
 *
 *  @param {object} jsToSql maps js-style data fields to database column names,
 *   like { firstName: "first_name", age: "age" }
 *
 *  returns object containing SQL SET string and array of values.
 *
 *  * @example {firstName: 'Aliya', age: 32}, {firstName: "first_name"} =>
 *   { setCols: '"first_name"=$1, "age"=$2',
 *     values: ['Aliya', 32] }
 *
 **/

function sqlForPartialUpdate(dataToUpdate, jsToSql = {}) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map(
    (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = {
  sqlForPartialUpdate,
  sqlForWhereString,
};
