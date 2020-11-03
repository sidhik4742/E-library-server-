var express = require("express");
const app = require("../../app");
var router = express.Router();

const customerHelper = require("../../helpers/customer/customerHelper.js");

/**
 * ////////////////TODO:- Customer login form route/////////////
 * */

router.post("/login", (req, res) => {
  customerHelper.loginCredentials(req.body, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Customer signup form route/////////////
 * */

router.post("/signup", (req, res) => {
  customerHelper.insertSignUpDetails(req.body, (result) => {
    res.send(result);
  });
});

module.exports = router;
