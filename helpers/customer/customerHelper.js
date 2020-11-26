const db = require('../../config/config');
const bcrypt = require('bcrypt');
const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');
const {log} = require('debug');
const {query} = require('express');
const {default: orderId} = require('order-id');

const saltRounds = 10;
const customerDetailsCollection = 'customerPersonalDetails';
const productDetailsCollection = 'productDetails';
const orderCollection = 'order';
const addToCartCollection = 'cart';
const orderHistoryCollection = 'orderHistory';
const shipAddressCollection = 'shipAddress';

const jwtPrivateKey = 'e-libraryapplicationCustomer';

module.exports = {
  insertSignUpDetails: (data, callback) => {
    let {firstName, lastName, userName, email, password, shipAddress} = data;
    console.log(shipAddress);
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    let query = {userName: userName};
    try {
      db.getConnection()
        .collection(customerDetailsCollection)
        .find(query)
        .toArray()
        .then((collection) => {
          console.log(collection);
          console.log(collection.length);
          if (collection.length === 0) {
            console.log('true');
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
                  console.error('registration failed please try again');
                } else {
                  console.log(result.ops);
                  return callback({
                    status: 200,
                    message: 'Register successfully',
                  });
                }
              });
          } else {
            console.log('User already registered');
            return callback({
              status: 301,
              message: 'user already registered',
            });
          }
        });
    } catch (error) {
      console.log(`Connection error ${error}`);
    }
  },
  loginCredentials: (data, callback) => {
    console.log(data);
    let {userName, password} = data;
    let query = {userName};
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
                message: 'Login successful',
                customer: collection[0].userName,
                customerToken: customerToken,
              });
            }
          } else {
            return callback({
              status: 301,
              message: 'Login failed',
            });
          }
        });
    } catch (error) {
      console.log(`Connection error ${error}`);
    }
  },
  productDetails: (callback) => {
    console.log('database connection');
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
    let query = {customerName: customer};
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
                console.error('registration failed please try again');
              } else {
                console.log(result.ops);
                return callback({
                  status: 200,
                  message: 'Register successfully',
                });
              }
            });
        } else {
          console.log('else condition');
          let query = {bookName: cartData.bookName};

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
                      console.error('registration failed please try again');
                    } else {
                      console.log(result.ops);
                      return callback({
                        status: 200,
                        message: 'Register successfully',
                      });
                    }
                  });
              } else {
                return callback({
                  status: 309,
                  message: 'Book already in the cart',
                });
              }
            });
        }
      });
  },
  viewCart: (name, callback) => {
    let query = {customerName: name};
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
  editViewCart: (name, data, callback) => {
    let query = {customerName: name};
    console.log(item);
    db.getConnection()
      .collection(addToCartCollection)
      .deleteMany(query)
      .then((result) => {
        db.getConnection()
          .collection(addToCartCollection)
          .insertOne()
          .then((result) => {
            console.log(result);
            return callback({
              status: 200,
              data: result,
            });
          });
      });
  },
  removeCartItem: (name, id, callback) => {
    let query = {customerName: name, _id: id};
    db.getConnection()
      .collection(addToCartCollection)
      .deleteOne(query)
      .then((result) => {
        console.log(result.result);
        if (result.result.n) {
          return callback({status: 200, result: result});
        } else {
          return callback({status: 409, result: result});
        }
      });
  },
  chekout: (name, callback) => {
    db.getConnection()
      .collection(addToCartCollection)
      .aggregate([
        {
          $lookup: {
            from: 'customerPersonalDetails',
            localField: 'customerName',
            foreignField: 'userName',
            as: 'customerPersonalDetails_Docs',
          },
        },
      ])
      .toArray()
      .then((result) => {
        console.log(result[0].customerPersonalDetails_Docs[0].shipAddress);
        if (result.length != 0) {
          callback({
            status: 200,
            result: result[0].customerPersonalDetails_Docs[0].shipAddress,
          });
        } else {
          callback({status: 200, result: 'Empty Data'});
        }
      });
  },
  editShipAddress: (name, data, callback) => {
    let query = {userName: name};

    db.getConnection()
      .collection(customerDetailsCollection)
      .findOneAndUpdate(query, {
        $set: {
          shipAddress: data,
        },
      })
      .then((result) => {
        console.log(result);
        if (result.result.ok) {
          return callback({status: 200, result: result});
        } else {
          return callback({status: 409, result: result});
        }
      });
  },
  OrderHistory: (data, callback) => {
    let {orderDetails, orderDateAndPaymentMethod, transactionDetails} = data;
    try {
      // console.log("true");
      db.getConnection()
        .collection(orderHistoryCollection)
        .insertOne({
          orderId: transactionDetails.orderId,
          orderDetails: orderDetails,
          paymentOption: orderDateAndPaymentMethod.paymentOption,
          orderDate: orderDateAndPaymentMethod.orderDate,
          status: transactionDetails.status,
        })
        .then((result) => {
          if (!result.ops) {
            console.error(
              'Insert order list to database is failed, please try again'
            );
          } else {
            console.log(result.ops);
            return callback({
              status: 200,
              message: 'Register successfully',
            });
          }
        });
    } catch (error) {
      console.log(`Connection error ${error}`);
    }
  },
  removeAllCartItem: (name, callback) => {
    let query = {customerName: name};
    db.getConnection()
      .collection(addToCartCollection)
      .remove(query)
      .then((result) => {
        console.log(result.result);
        if (result.result.n) {
          return callback({status: 200, result: result});
        } else {
          return callback({status: 409, result: result});
        }
      });
  },
  editCustomerDetails: (name, callback) => {
    let query = {customerName: name};
    db.getConnection()
      .collection(orderHistoryCollection)
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

  CustomerDetails: (name, callback) => {
    let query = {userName: name};
    db.getConnection()
      .collection(customerDetailsCollection)
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

  myOrderList: (customerName, callback) => {
    // let query = { customerName: name };
    db.getConnection()
      .collection(orderHistoryCollection)
      .aggregate([
        {$unwind: '$orderDetails'},
        {$match: {'orderDetails.customerName': customerName}},
        {
          $group: {
            _id: {
              paymentOption: '$paymentOption',
              orderId: '$orderId',
              orderDate: '$orderDate',
              customerName: '$orderDetails.customerName',
              image: '$orderDetails.imageUrl',
              bookName: '$orderDetails.bookName',
              totalPrice: '$orderDetails.offerPrice',
              price: '$orderDetails.price',
              soldBy: '$orderDetails.dealerName',
              status: '$status',
            },
          },
        },
      ])
      .toArray()
      .then((result) => {
        console.log(result);
        return callback({
          status: 200,
          data: result,
        });
      });
  },
  addMultipleShipAddress: (name, data, callback) => {
    console.log('Ship address');
    let query = {userName: name, mobileNumber: data.mobileNumber};
    try {
      db.getConnection()
        .collection(shipAddressCollection)
        .find(query)
        .toArray()
        .then((collection) => {
          // console.log(collection);
          console.log(collection.length);
          if (collection.length === 0) {
            console.log('true');
            db.getConnection()
              .collection(shipAddressCollection)
              .insertOne({
                userName: name,
                fullName: data.fullName,
                mobileNumber: data.mobileNumber,
                address: data.address,
                landmark: data.landmark,
                townOrCity: data.townOrCity,
                pincode: data.pincode,
              })
              .then((result) => {
                console.log(result);
                return callback({status: 200, data: result});
              });
          } else {
            return callback({
              status: 309,
              message: 'Ship address already exist',
            });
          }
        });
    } catch (error) {
      console.log('Database connection failed');
    }
  },
  getAllMultipleAddress: (name, callback) => {
    let query = {userName: name};
    db.getConnection()
      .collection(shipAddressCollection)
      .find(query)
      .toArray()
      .then((collection) => {
        console.log(collection);
        return callback({status: 200, data: collection});
      });
  },
  defaultShipAddress: (name, data, callback) => {
    console.log(data);
    let query = {
      userName: name,
    };
    db.getConnection()
      .collection(customerDetailsCollection)
      .findOneAndUpdate(query, {
        $set: {
          shipAddress: data,
        },
      })
      .then((result) => {
        console.log(result);
        if (result) {
          return callback({status: 200, result: result});
        } else {
          return callback({status: 409, result: result});
        }
      });
  },
  updateProfilePic: (name, imagePath, callback) => {
    let imageUrl;
    try {
      let splitImageUrl = imagePath.path.split('/');
      imageUrl = `${splitImageUrl[1]}/${splitImageUrl[2]}/${splitImageUrl[3]}`;
    } catch (error) {
      imageUrl = imagePath.path;
      console.log(error);
    }
    let query = {userName: name};
    db.getConnection()
      .collection(customerDetailsCollection)
      .findOneAndUpdate(
        query,
        {
          $set: {
            ProfilePictureUrl: imageUrl,
          },
        },
        {upsert: true}
      )
      .then((result) => {
        console.log(result);
        return callback({
          status: 200,
          data: result.value,
        });
      });
  },
  cartCount: (name, callback) => {
    let query = {customerName: name};
    db.getConnection()
      .collection(addToCartCollection)
      .find(query)
      .count()
      .then((collection) => {
        console.log(collection);
        return callback({status: 200, data: collection});
      });
  },
  mobileNumberIsValid: (number, callback) => {
    // let query = {mobileNumber: number};
    db.getConnection()
      .collection(customerDetailsCollection)
      .aggregate([
        {$unwind: '$shipAddress'},
        {$match: {'shipAddress.mobileNumber': number}},
      ])
      .toArray()
      .then((collection) => {
        console.log(collection);
        if (collection.length != 0) {
          return callback({status: 200, message: 'User is valid'});
        } else {
          return callback({status: 309, message: 'User not valid'});
        }
        // return callback({status: 200, data: collection});
      });
  },
};
