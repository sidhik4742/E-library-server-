const db = require("../../config/config");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

const saltRounds = 10;
const dealerDetailsCollection = "dealerPersonalDetails";

module.exports = {
  insertSignupDetails: (data, callback) => {
    console.log(data);
    let { name, userName, email, password } = data;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    let query = { userName: userName };
    try {
      db.getConnection()
        .collection(dealerDetailsCollection)
        .find(query)
        .toArray()
        .then((collection) => {
          console.log(collection);
          console.log(collection.length);
          if (collection.length === 0) {
            // console.log("true");
            db.getConnection()
              .collection(dealerDetailsCollection)
              .insertOne({
                name: name,
                userName: userName,
                email: email,
                password: hashedPassword,
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
    try {
      db.getConnection()
        .collection(dealerDetailsCollection)
        .find(query)
        .toArray()
        .then((collection) => {
          //   console.log(collection);
          if (collection.length != 0) {
            if (bcrypt.compareSync(password, collection[0].password)) {
              //   console.log("password match");
              return callback({
                status: 200,
                message: "Login successful",
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
