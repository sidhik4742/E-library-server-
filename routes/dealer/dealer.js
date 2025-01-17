var express = require('express');
const app = require('../../app');
var router = express.Router();
let multer = require('multer');
let path = require('path');
const jwt = require('jsonwebtoken');

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/product');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + Date.now() + '.jpg');
  },
});

var uploadProduct = multer({storage: storage1}).any();

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/dealersDP');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + Date.now() + '.jpg');
  },
});

var uploadDealerProfilPic = multer({storage: storage2}).any();

const jwtPrivateKey = 'e-libraryapplicationDealer';

const dealerValidation = (req, res, next) => {
  let dealerToken = req.headers.dealerauth;
  let dealerName = req.headers.dealername;
  console.log(dealerToken, dealerName);
  jwt.verify(dealerName, jwtPrivateKey, function (error, decoded) {
    console.log(decoded);
    if (decoded == dealerName) {
      next();
    } else {
      console.log(error);
      res.send({status: 403, message: 'authorization failed'});
    }
  });
};

const dealerHelper = require('../../helpers/dealer/dealerHelper');

/**
 * ////////////////TODO:- Dealer login form route/////////////
 * */

router.post('/login', (req, res) => {
  dealerHelper.loginCredentials(req.body, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Dealer signup form route/////////////
 * */

router.post('/signup', uploadDealerProfilPic, (req, res) => {
  let data = {
    profilePic: req.files[0],
    signupData: JSON.parse(req.body.dealerSignupData),
  };
  // console.log(data);
  dealerHelper.insertSignupDetails(data, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Dealer can access product-route/////////////
 * */

router.get('/dashboard/product-list', (req, res) => {
  let dealerName = req.headers.dealername;
  dealerHelper.productDetails(dealerName, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Dealer can add product-route/////////////
 * */

router.post('/dashboard/product-list', uploadProduct, (req, res) => {
  let data = {
    bookImage: req.files[0],
    bookInfo: JSON.parse(req.body.bookInfo),
  };
  let dealerName = req.headers.dealername;
  dealerHelper.productAdd(dealerName, data, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Dealer can edit product-route/////////////
 * */

router.put('/dashboard/product-list', uploadProduct, (req, res) => {
  let data = {
    bookImage: req.files[0],
    bookInfo: JSON.parse(req.body.bookInfo),
  };
  let dealerName = req.headers.dealername;
  console.log(dealerName);
  dealerHelper.productEdit(dealerName, data, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Dealer can delete product-route/////////////
 * */

router.delete('/dashboard/product-list', (req, res) => {
  let id = req.query.id;
  dealerHelper.productRemove(id, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Dealer can access product-route/////////////
 * */

router.get('/dashboard/orderlist', (req, res) => {
  let dealerName = req.query.dealerName;
  dealerHelper.orderHistory(dealerName, (result) => {
    res.send(result);
  });
});
/**
 * ////////////////TODO:- Dealer can take action product-route/////////////
 * */

router.put('/dashboard/orderlist', (req, res) => {
  let orderId = req.body.params.orderId;
  let orderStatus;
  if (req.body.data.orderStatus === 'approve') orderStatus = 'Dispatched';
  else orderStatus = 'Cancelled';

  console.log(orderId, orderStatus);
  console.log(orderStatus);
  dealerHelper.statusUpdation(orderId, orderStatus, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Dealer get all details count/////////////
 * */

router.get('/dashboard/getalldetailscount', (req, res) => {
  let dealerName = req.headers.dealername;
  dealerHelper.getAllDetailsCount(dealerName, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Dealer can creat coupon offer -route/////////////
 * */

router.post('/dashboard/couponoffer', (req, res) => {
  console.log(req.body);
  let dealerName = req.query.dealerName;
  let data = req.body;
  dealerHelper.couponOfferManage(dealerName, data, (result) => {
    res.send(result);
  });
});

router.get('/dashboard/getallcoupon', (req, res) => {
  let dealerName = req.query.name;
  dealerHelper.getAllCoupon(dealerName, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Dealer can delete offer-route/////////////
 * */

router.delete('/dashboard/couponoffer', (req, res) => {
  let id = req.query.id;
  dealerHelper.offerRemove(id, (result) => {
    res.send(result);
  });
});

module.exports = router;
