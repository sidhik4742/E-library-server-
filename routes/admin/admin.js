var express = require("express");
const app = require("../../app");
var router = express.Router();
const jwt = require("jsonwebtoken");

const jwtPrivateKey = "e-libraryapplicationAdmin";

const adminHelper = require("../../helpers/admin/adminHelper");

const adminValidation = (req, res, next) => {
  console.log("middleware");
  let token = req.headers.auth;
  console.log(token);
  jwt.verify(token, jwtPrivateKey, function (error, decoded) {
    console.log(decoded);
    if (decoded === "admin") {
      next();
    } else {
      res.send({ status: 403, message: "authorization failed" });
    }
  });
};

/**
 * ////////////////TODO:- Customer login form route/////////////
 * */

router.post("/login", (req, res) => {
  adminHelper.loginCredentials(req.body, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- admin dashboard route/////////////
 * */

router.get("/dashboard", adminValidation, (req, res) => {
  // adminHelper.insertSignUpDetails(req.body, (result) => {
  //   res.send(result);
  // });
  res.send({ status: 200, message: "success" });
});

module.exports = router;
