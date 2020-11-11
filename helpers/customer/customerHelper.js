const db = require("../../config/config");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const { log } = require("debug");
const { query } = require("express");

const saltRounds = 10;
const customerDetailsCollection = "customerPersonalDetails";
const productDetailsCollection = "productDetails";
const addToCartCollection = "cart";

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
  productDetails: (callback) => {
    console.log("database connection");
    db.getConnection()
      .collection(productDetailsCollection)
      .find()
      .toArray()
      .then((result) => {
        console.log(result);
        return callback({
          status: 200,
          data: result,
        });
      });
  },
  addToCart: (data, callback) => {
    // console.log(data);
    let cartData = data[0];
    let customer = data[1].customer;
    // console.log(cartData);
    let query = { customerName: customer };
    cartData.customerName = customer;
    cartData.quantity = 1;
    db.getConnection()
      .collection(addToCartCollection)
      .find(query)
      .toArray()
      .then((result) => {
        if (result.length === 0) {
          db.getConnection()
            .collection(addToCartCollection)
            .insertOne(cartData)
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
          console.log("else condition");
          let query = { bookName: cartData.bookName };

          db.getConnection()
            .collection(addToCartCollection)
            .find(query)
            .toArray()
            .then((result) => {
              console.log(result);
              if (result.length === 0) {
                db.getConnection()
                  .collection(addToCartCollection)
                  .insertOne(cartData)
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
                return callback({
                  status: 309,
                  message: "Book already in the cart",
                });
              }
            });
        }
      });
  },
  viewCart: (name, callback) => {
    let query = { customerName: name };
    db.getConnection()
      .collection(addToCartCollection)
      .find(query)
      .toArray()
      .then((result) => {
        console.log(result);
        return callback({
          status: 200,
          data: result,
        });
      });
  },
};
