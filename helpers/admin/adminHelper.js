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
  dealerDetails: (callback) => {
    db.getConnection()
      .collection(dealerDetailsCollection)
      .find()
      .toArray()
      .then((result) => {
        // console.log(result);
        return callback(result);
      });
  },
  dealerRemove: (id, callback) => {
    console.log(id);
    let query = { _id: ObjectId(id) };
    db.getConnection()
      .collection(dealerDetailsCollection)
      .deleteOne(query)
      .then((result) => {
        // console.log(result.result);
        if (result.result.ok) {
          return callback({ status: 200, result: result });
        } else {
          return callback({ status: 409, result: result });
        }
      });
  },
  dealerEdit: () => {},
  dealerAdd: () => {},
};
