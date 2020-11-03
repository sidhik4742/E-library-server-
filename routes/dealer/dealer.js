var express = require("express");
const app = require("../../app");
var router = express.Router();

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

module.exports = router;
