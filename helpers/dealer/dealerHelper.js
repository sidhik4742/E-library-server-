const db = require('../../config/config');
const bcrypt = require('bcrypt');
const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const customerDetailsCollection = 'customerPersonalDetails';
const dealerDetailsCollection = 'dealerPersonalDetails';
const productDetailsCollection = 'productDetails';
const orderHistoryCollection = 'orderHistory';

const jwtPrivateKey = 'e-libraryapplicationDealer';

module.exports = {
  insertSignupDetails: (data, callback) => {
    // console.log(data);
    let {name, userName, email, password} = data.signupData;
    let {profilePic} = data;
    // console.log(profilePic);
    let splitImageUrl = profilePic.path.split('/');
    let imageUrl = `${splitImageUrl[1]}/${splitImageUrl[2]}/${splitImageUrl[3]}`;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    let query = {userName: userName};
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
                profilePic: imageUrl,
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
        .collection(dealerDetailsCollection)
        .find(query)
        .toArray()
        .then((collection) => {
          console.log(collection);
          if (collection.length != 0) {
            if (bcrypt.compareSync(password, collection[0].password)) {
              //   console.log("password match");
              let token = jwt.sign(jwtPublicKey, jwtPrivateKey);
              return callback({
                status: 200,
                message: 'Login successful',
                dealerToken: token,
                userName: userName,
                profilePic: collection[0].profilePic,
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
  productAdd: (dealerName, data, callback) => {
    let {bookImage, bookInfo} = data;
    console.log(bookImage, bookInfo);
    let splitImageUrl = bookImage.path.split('/');
    let imageUrl = `${splitImageUrl[1]}/${splitImageUrl[2]}/${splitImageUrl[3]}`;
    // console.log(imageUrl);
    let query = {bookName: bookInfo.bookName};
    try {
      db.getConnection()
        .collection(productDetailsCollection)
        .find(query)
        .toArray()
        .then((collection) => {
          console.log(collection);
          console.log(collection.length);
          if (collection.length === 0) {
            // console.log("true");
            db.getConnection()
              .collection(productDetailsCollection)
              .insertOne({
                dealerName: bookInfo.dealerName,
                bookName: bookInfo.bookName,
                authorName: bookInfo.authorName,
                publisher: bookInfo.publisher,
                category: bookInfo.category,
                price: bookInfo.price,
                offer: bookInfo.offer,
                edition: bookInfo.editions,
                noPages: bookInfo.noPages,
                language: bookInfo.language,
                discription: bookInfo.discription,
                imageUrl: imageUrl,
              })
              .then((result) => {
                if (!result.result.ok) {
                  console.error('Book registration failed please try again');
                } else {
                  module.exports.productDetails(dealerName, (result) => {
                    console.log(result.ops);
                    return callback({
                      status: 200,
                      message: 'Register successfully',
                      result: result,
                    });
                  });
                }
              });
          } else {
            console.log('Book already registered');
            return callback({
              status: 301,
              message: 'Book already registered',
            });
          }
        });
    } catch (error) {
      console.log(`Connection error ${error}`);
    }
  },
  productDetails: (dealerName, callback) => {
    console.log('database connection');
    let query = {dealerName: dealerName};
    db.getConnection()
      .collection(productDetailsCollection)
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
  productEdit: (dealerName, data, callback) => {
    let query = {bookName: data.bookInfo.bookName};
    console.log(query);
    let imageUrl;
    try {
      splitImageUrl = bookImage.path.split('/');
      imageUrl = `${splitImageUrl[1]}/${splitImageUrl[2]}`;
    } catch (error) {
      imageUrl = data.bookInfo.imageUrl;
    }
    console.log(imageUrl);

    db.getConnection()
      .collection(productDetailsCollection)
      .findOneAndUpdate(query, {
        $set: {
          bookName: data.bookInfo.bookName,
          authorName: data.bookInfo.authorName,
          publisher: data.bookInfo.publisher,
          price: data.bookInfo.price,
          offer: data.bookInfo.offer,
          edition: data.bookInfo.editions,
          noPages: data.bookInfo.noPages,
          language: data.bookInfo.language,
          discription: data.bookInfo.discription,
          imageUrl: imageUrl,
        },
      })
      .then((result) => {
        console.log(result);
        if (result.value) {
          let query = {dealerName: dealerName};
          db.getConnection()
            .collection(productDetailsCollection)
            .find(query)
            .toArray()
            .then((result) => {
              // console.log(result);
              return callback({status: 200, data: result});
            });
        }
      });
  },
  productRemove: (id, callback) => {
    console.log(`id=${id}`);
    let query = {_id: ObjectId(id)};
    db.getConnection()
      .collection(productDetailsCollection)
      .deleteOne(query)
      .then((result) => {
        // console.log(result);
        if (result.result.n) {
          return callback({status: 200, result: result});
        } else {
          return callback({status: 409, result: result});
        }
      });
  },

  orderHistory: (dealerName, callback) => {
    // let query = { dealerName: dealerName };
    db.getConnection()
      .collection(orderHistoryCollection)
      .aggregate([
        {$unwind: '$orderDetails'},
        {$match: {'orderDetails.dealerName': dealerName}},
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

  getAllDetailsCount: (dealerName, callback) => {
    let allDetailsCount = {
      totalSaleAmount: 0,
      date: [],
      amount: [],
    };
    let query = {dealerName: dealerName};
    db.getConnection()
      .collection(productDetailsCollection)
      .find(query)
      .count()
      .then((result) => {
        console.log(result);
        allDetailsCount.productCount = result;
      });
    db.getConnection()
      .collection(customerDetailsCollection)
      .find(query)
      .count()
      .then((result) => {
        console.log(result);
        allDetailsCount.customerCount = result;
        console.log(allDetailsCount);
      });
    db.getConnection()
      .collection(orderHistoryCollection)
      .aggregate([
        {$unwind: '$orderDetails'},
        {$match: {'orderDetails.dealerName': 'jhon'}},
      ])
      .toArray()
      .then((result) => {
        // console.log(result);
        // allDetailsCount.customerCount = result;
        result.forEach((sale) => {
          allDetailsCount.date.push(sale.orderDate);
          allDetailsCount.amount.push(parseInt(sale.orderDetails.offerPrice));
          allDetailsCount.totalSaleAmount =
            allDetailsCount.totalSaleAmount +
            parseInt(sale.orderDetails.offerPrice);
          // console.log(parseInt(sale.orderDetails.offerPrice));
        });
        console.log(allDetailsCount);
        return callback({
          status: 200,
          data: allDetailsCount,
        });
      });
  },
  statusUpdation: (orderId, orderStatus, callback) => {
    console.log('database connection');
    let query = {orderId: orderId};
    db.getConnection()
      .collection(orderHistoryCollection)
      .findOneAndUpdate(query, {
        $set: {
          status: orderStatus,
        },
      })
      .then((result) => {
        console.log(result);
        return callback({
          status: 200,
          data: result,
        });
      });
  },
};
