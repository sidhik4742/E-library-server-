const db = require("../../config/config");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const saltRounds = 10;
const customerDetailsCollection = "customerPersonalDetails";
const jwtPrivateKey = "e-libraryapplicationCustomer";

module.exports = {
  insertSignUpDetails: (data, callback) => {
    let { firstName, lastName, userName, email, password, shipAddress } = data;
    console.log(shipAddress);
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    let query = { userName: userName };
    try {
      db.getConnection()
        .collection(customerDetailsCollection)
        .find(query)
        .toArray()
        .then((collection) => {
          console.log(collection);
          console.log(collection.length);
          if (collection.length === 0) {
            console.log("true");
            db.getConnection()
              .collection(customerDetailsCollection)
              .insertOne({
                firstName: firstName,
                lastName: lastName,
                userName: userName,
                email: email,
                password: hashedPassword,
                shipAddress: shipAddress,
              })
              .then((result) => {
                if (!result.result.ok) {
                  console.error("registration failed please try again");
                } else {
                  console.log(result.ops);
                  return callback({
                    status: 200,
                    message: "Register successfully",
                  });
                }
              });
          } else {
            console.log("User already registered");
            return callback({
              status: 301,
              message: "user already registered",
            });
          }
        });
    } catch (error) {
      console.log(`Connection error ${error}`);
    }
  },
  loginCredentials: (data, callback) => {
    console.log(data);
    let { userName, password } = data;
    let query = { userName };
    let jwtPublicKey = userName;
    try {
      db.getConnection()
        .collection(customerDetailsCollection)
        .find(query)
        .toArray()
        .then((collection) => {
          console.log(collection);
          if (collection.length != 0) {
            if (bcrypt.compareSync(password, collection[0].password)) {
              //   console.log("password match");
              let customerToken = jwt.sign(jwtPublicKey, jwtPrivateKey);
              return callback({
                status: 200,
                message: "Login successful",
                customer: collection[0].userName,
                customerToken: customerToken,
              });
            }
          } else {
            return callback({
              status: 301,
              message: "Login failed",
            });
          }
        });
    } catch (error) {
      console.log(`Connection error ${error}`);
    }
  },
};
