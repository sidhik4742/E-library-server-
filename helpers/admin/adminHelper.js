const db = require("../../config/config");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const saltRounds = 10;
const dealerDetailsCollection = "dealerPersonalDetails";
const jwtPrivateKey = "e-libraryapplicationAdmin";

/**
 * ? username : admin
 * ? password : admin
 */

module.exports = {
  loginCredentials: (data, callback) => {
    console.log(data);
    const adminUserName = "admin";
    const adminPassword = "admin";
    let jwtPublicKey = adminUserName;
    let { userName, password } = data;

    if (adminPassword === userName && adminPassword === password) {
      let token = jwt.sign(jwtPublicKey, jwtPrivateKey);
      return callback({
        status: 200,
        auth: true,
        message: "Login successful",
        token: token,
      });
    } else {
      return callback({
        status: 301,
        message: "Login failed",
      });
    }
  },

};
