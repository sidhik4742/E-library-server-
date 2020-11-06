var express = require("express");
const app = require("../../app");
var router = express.Router();
let multer = require("multer");
let upload = multer({ dest: "../../productImages" });

var cpUpload = upload.fields([{ name: "bookImg" }, { name: "bookInfo" }]);
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
 * ////////////////TODO:- Dealer can add product-route/////////////
 * */

router.post("/dashboard/product-list", cpUpload, (req, res) => {
  console.log(req.files["bookImg"][0]);
  console.log(req.body.bookInfo.bookName);

  // dealerHelper.loginCredentials(req.body, (result) => {
  // res.send(result);
  // });
});


module.exports = router;
