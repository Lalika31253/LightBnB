const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

// the following assumes that you named your connection variable `pool` for checking purpose
// pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => {console.log(response)});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  // let resolvedUser = null;
  // for (const userId in users) {
  //   const user = users[userId];
  //   if (user && user.email.toLowerCase() === email.toLowerCase()) {
  //     resolvedUser = user;
  //   }
  // }
  // return Promise.resolve(resolvedUser);
  const query = 'SELECT * FROM users WHERE email =$1';
  return pool.query(query, [email])
    .then((result) => {
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log("Email error is:", err);
      throw err;
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  // return Promise.resolve(users[id]);
  const query = 'SELECT * FROM users WHERE id =$1';
  return pool.query(query, [id])
    .then((result) => {
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log("User id error is:", err);
      throw err;
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
  const query = 'INSERT INTO users (name, email, password) VALUES($1, $2, $3) RETURNING *';
  return pool.query(query, [user.name, user.email, user.password])
    .then((result) => {
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log("User eror is:", err);
      throw err;
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  // return getAllProperties(null, 2);

  const query = `SELECT reservations.*, properties.* 
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id=$1
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2`;

  return pool.query(query, [guest_id, limit])
    .then((result) => {
      if (result.rows.length > 0) {
        return result.rows;
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log("Guest id eror is:", err);
      throw err;
    });

};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */


const getAllProperties = function (options, limit = 10) {
  // const limitedProperties = {};
  // for (let i = 1; i <= limit; i++) {
  //   limitedProperties[i] = properties[i];
  // }
  // return Promise.resolve(limitedProperties);

  const queryParams = []; //to hold any parameters that may be available for the query

  let queryString = "SELECT properties.*, AVG(property_reviews.rating) AS average_rating " +
  "FROM properties " +
  "JOIN property_reviews ON property_reviews.property_id = properties.id ";

  if (options.city) { //check if the city has been passed in as an option
    queryParams.push(`%${options.city}%`);
    queryString += "WHERE city LIKE $" + queryParams.length + " ";
  }

  if (options.owner_id && !options.city) {//check if an owner_id passed in as an option
    queryParams.push(options.owner_id);
    queryString += "WHERE owner_id = $" + queryParams.length;
  } else if (options.owner_id && options.city) {
    queryParams.push(options.owner_id);
    queryString += "AND owner_id = $" + queryParams.length;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night && !options.city && !options.owner_id) {
    queryParams.push(options.minimum_price_per_night);
    queryString += "WHERE (cost_per_night/100) > $" + queryParams.length;
    queryParams.push(options.maximum_price_per_night);
    queryString += "AND (cost_per_night/100) < $" + queryParams.length;
  } else if (options.minimum_price_per_night && options.maximum_price_per_night && (options.city || options.owner_id)) {
    queryParams.push(options.minimum_price_per_night);
    queryString += "AND (cost_per_night/100) > $" + queryParams.length;
    queryParams.push(maximum_price_per_night);
    queryString += "AND (cost_per_night/100) < $" + queryParams.length;
  }

  if(options.minimum_rating && !options.city && !options.owner_id && !options.minimum_price_per_night && !options.maximum_price_per_night) {
    queryParams.push(options.minimum_rating);
    queryString += "HAVING AVG(property_reviews.rating) >= $" + queryParams.length;
  } else if (options.minimum_rating && (options.city || options.owner_id || options.minimum_price_per_night || options.maximum_price_per_night)) {
    queryParams.push(options.minimum_rating);
    queryString += "AND AVG(property_reviews.rating) >= $" + queryParams.length;
  }


  queryParams.push(limit);
  //add the rest of the query that comes after the WHERE clause
  queryString += `GROUP BY properties.id 
    ORDER BY cost_per_night
    LIMIT $${queryParams.length}`;

  // console.log(queryString, queryParams);


  pool
    .query(queryString, queryParams)
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });

};


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
