var express = require('express');
const app = require('../../app');
var router = express.Router();
const jwt = require('jsonwebtoken');

const jwtPrivateKey = 'e-libraryapplicationAdmin';

const adminHelper = require('../../helpers/admin/adminHelper');
const dealerHelper = require('../../helpers/dealer/dealerHelper');

const adminValidation = (req, res, next) => {
  console.log('middleware');
  let token = req.headers.auth;
  console.log(token);
  jwt.verify(token, jwtPrivateKey, function (error, decoded) {
    console.log(decoded);
    if (decoded === 'admin') {
      next();
    } else {
      res.send({status: 403, message: 'authorization failed'});
    }
  });
};

/**
 * ////////////////TODO:- admin login form route/////////////
 * */

router.post('/login', (req, res) => {
  adminHelper.loginCredentials(req.body, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- admin dashboard route/////////////
 * */

router.get('/dashboard', adminValidation, (req, res) => {
  adminHelper.dealerDetails((result) => {
    console.log(result);
    res.send({status: 200, data: result});
  });
});

/**
 *  //////////TODO:- admin have a permission to delete dealer/////
 * */

router.delete('/dashboard', (req, res) => {
  let id = req.query.id;
  adminHelper.dealerRemove(id, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- admin have a permission to add dealer/////////////
 * */

router.post('/dashboard', (req, res) => {
  dealerHelper.insertSignupDetails(req.body, (result) => {
    console.log(result);
    res.send(result);
  });
});

/**
 * ////////////////TODO:- admin have a permission to update dealer/////////////
 * */

router.put('/dashboard', (req, res) => {
  adminHelper.dealerEdit(req.body, (result) => {
    console.log(result);
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Dealer can access usersList-route/////////////
 * */

router.get('/dashboard/users-list', (req, res) => {
  // let dealerName = req.headers.dealername;
  adminHelper.userDetails((result) => {
    console.log(result);
    res.send(result);
  });
});

/**
 *  //////////TODO:- admin have a permission to delete user/////
 * */

router.delete('/dashboard/users-list', (req, res) => {
  let id = req.query.id;
  adminHelper.userRemove(id, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- admin have a permission to update dealer/////////////
 * */

router.put('/dashboard/users-list', (req, res) => {
  adminHelper.userEdit(req.body, (result) => {
    console.log(result);
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Dealer can access usersList-route/////////////
 * */

router.get('/dashboard/getalldetailscount', (req, res) => {
  console.log("admin root");
  adminHelper.getAllDetailsCount((result) => {
    console.log(result);
    res.send(result);
  });
});

module.exports = router;
