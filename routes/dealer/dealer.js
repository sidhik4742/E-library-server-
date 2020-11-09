var express = require("express");
const app = require("../../app");
var router = express.Router();
let multer = require("multer");
let path = require("path");
const jwt = require("jsonwebtoken");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage }).any();

const jwtPrivateKey = "e-libraryapplicationDealer";

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
      res.send({ status: 403, message: "authorization failed" });
    }
  });
};

const dealerHelper = require("../../helpers/dealer/dealerHelper");

/**
 * ////////////////TODO:- Dealer login form route/////////////
 * */

router.post("/login", (req, res) => {
  dealerHelper.loginCredentials(req.body, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Dealer signup form route/////////////
 * */

router.post("/signup", (req, res) => {
  dealerHelper.insertSignupDetails(req.body, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Dealer can access product-route/////////////
 * */

router.get("/dashboard/product-list", (req, res) => {
  let dealerName = req.headers.dealername;
  dealerHelper.productDetails(dealerName, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Dealer can add product-route/////////////
 * */

router.post("/dashboard/product-list", upload, (req, res) => {
  let data = {
    bookImage: req.files[0],
    bookInfo: JSON.parse(req.body.bookInfo),
  };
  dealerHelper.productAdd(data, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Dealer can edit product-route/////////////
 * */

router.put("/dashboard/product-list", upload, (req, res) => {
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

router.delete("/dashboard/product-list", (req, res) => {
  let id = req.query.id;
  dealerHelper.productRemove(id, (result) => {
    res.send(result);
  });
});

module.exports = router;
