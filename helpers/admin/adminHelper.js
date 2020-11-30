const db = require('../../config/config');
const bcrypt = require('bcrypt');
const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const dealerDetailsCollection = 'dealerPersonalDetails';
const customerDetailsCollection = 'customerPersonalDetails';
const productDetailsCollection = 'productDetails';
const orderHistoryCollection = 'orderHistory';

const jwtPrivateKey = 'e-libraryapplicationAdmin';

/**
 * ? username : admin
 * ? password : admin
 */

module.exports = {
  loginCredentials: (data, callback) => {
    console.log(data);
    const adminUserName = 'admin';
    const adminPassword = 'admin';
    let jwtPublicKey = adminUserName;
    let {userName, password} = data;

    if (adminPassword === userName && adminPassword === password) {
      let token = jwt.sign(jwtPublicKey, jwtPrivateKey);
      return callback({
        status: 200,
        auth: true,
        message: 'Login successful',
        token: token,
      });
    } else {
      return callback({
        status: 301,
        message: 'Login failed',
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
    let query = {_id: ObjectId(id)};
    db.getConnection()
      .collection(dealerDetailsCollection)
      .deleteOne(query)
      .then((result) => {
        console.log(result.result);
        if (result.result.ok) {
          return callback({status: 200, result: result});
        } else {
          return callback({status: 409, result: result});
        }
      });
  },
  dealerEdit: (data, callback) => {
    console.log(data.userName);
    let query = {userName: data.userName};

    db.getConnection()
      .collection(dealerDetailsCollection)
      .findOneAndUpdate(query, {
        $set: {
          name: data.name,
          userName: data.userName,
          email: data.email,
          password: data.password,
        },
      })
      .then((result) => {
        console.log(result);
        if (result.ok) {
          db.getConnection()
            .collection(dealerDetailsCollection)
            .find()
            .toArray()
            .then((result) => {
              // console.log(result);
              return callback({status: 200, data: result});
            });
        }
      });
  },
  userDetails: (callback) => {
    console.log('database connection');
    // let query = {dealerName: dealerName};
    db.getConnection()
      .collection(customerDetailsCollection)
      .find()
      .toArray()
      .then((result) => {
        // console.log(result);
        return callback(result);
      });
  },
  userRemove: (id, callback) => {
    console.log(id);
    let query = {_id: ObjectId(id)};
    db.getConnection()
      .collection(customerDetailsCollection)
      .deleteOne(query)
      .then((result) => {
        console.log(result.result);
        if (result.result.ok) {
          return callback({status: 200, result: result});
        } else {
          return callback({status: 409, result: result});
        }
      });
  },
  userEdit: (data, callback) => {
    console.log(data.userName);
    let query = {userName: data.userName};

    db.getConnection()
      .collection(customerDetailsCollection)
      .findOneAndUpdate(query, {
        $set: {
          name: data.name,
          userName: data.userName,
          email: data.email,
          password: data.password,
        },
      })
      .then((result) => {
        console.log(result);
        if (result.ok) {
          db.getConnection()
            .collection(dealerDetailsCollection)
            .find()
            .toArray()
            .then((result) => {
              // console.log(result);
              return callback({status: 200, data: result});
            });
        }
      });
  },
  getAllDetailsCount: (callback) => {
    let allDetailsCount = {
      date: [],
      amount: [],
    };
    db.getConnection()
      .collection(productDetailsCollection)
      .find()
      .count()
      .then((result) => {
        // console.log(result);
        allDetailsCount.productCount = result;
        db.getConnection()
          .collection(customerDetailsCollection)
          .find()
          .count()
          .then((result) => {
            console.log(result);
            allDetailsCount.customerCount = result;
            // console.log(allDetailsCount);
            db.getConnection()
              .collection(dealerDetailsCollection)
              .find()
              .count()
              .then((result) => {
                // console.log(result);
                allDetailsCount.dealerCount = result;
                // console.log(allDetailsCount);
                db.getConnection()
                  .collection(orderHistoryCollection)
                  .aggregate([
                    {$unwind: '$orderDetails'},
                    {$match: {'orderDetails.dealerName': 'jhon'}},
                  ])
                  .toArray()
                  .then((result) => {
                    // console.log(result);
                    result.forEach((sale) => {
                      allDetailsCount.date.push(sale.orderDate);
                      allDetailsCount.amount.push(
                        parseInt(sale.orderDetails.offerPrice)
                      );
                    });
                    return callback({
                      status: 200,
                      data: allDetailsCount,
                    });
                    console.log(allDetailsCount);
                  });
              });
          });
      });
  },
  blockUser: (customer, callback) => {
    let query = {userName: customer.customerName};
    db.getConnection()
      .collection(customerDetailsCollection)
      .findOneAndUpdate(
        query,
        {
          $set: {
            status: customer.data,
          },
        },
        {$upsert: true}
      )
      .then((result) => {
        console.log(result);
        return callback({status: 200, data: result});
      });
  },
  orderHistory: (dealerName, callback) => {
    // let query = { dealerName: dealerName };
    db.getConnection()
      .collection(orderHistoryCollection)
      .aggregate([
        {$unwind: '$orderDetails'},
        {
          $group: {
            _id: {
              orderId: '$orderId',
              bookName: '$orderDetails.bookName',
              quantity: '$orderDetails.quantity',
              price: '$orderDetails.price',
              totalPrice: '$orderDetails.offerPrice',
              orderDate: '$orderDate',
              paymenttype: '$paymentOption',
              customerName: '$orderDetails.customerName',
              soldBy: '$orderDetails.dealerName',
              status: '$status',
              // image: "$orderDetails.imageUrl",
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
};
