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
 * ////////////////TODO:- admin can access usersList-route/////////////
 * */

router.get('/dashboard/getalldetailscount', (req, res) => {
  console.log('admin root');
  adminHelper.getAllDetailsCount((result) => {
    console.log(result);
    res.send(result);
  });
});

/**
 * ////////////////TODO:- admin can block usersList-route/////////////
 * */

router.put('/dashboard/users-list/blockuser', (req, res) => {
  console.log('admin root');
  let userStatus = {
    customerName: req.body.params.customerName,
    customerId: req.body.params.customerId,
    data: req.body.data.status,
  };
  console.log(userStatus);
  adminHelper.blockUser(userStatus, (result) => {
    console.log(result);
    res.send(result);
  });
});

/**
 * ////////////////TODO:- admin can access product-route/////////////
 * */

router.get('/dashboard/orderlist', (req, res) => {
  let dealerName = req.query.dealerName;
  adminHelper.orderHistory(dealerName, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- admin can get all category-route/////////////
 * */

router.get('/dashboard/category', (req, res) => {
  adminHelper.getAllCategory((result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- admin can add category-route/////////////
 * */

router.post('/dashboard/addcategory', (req, res) => {
  let {name} = req.body;
  let category = name.charAt(0).toUpperCase() + name.slice(1);
  console.log('====================================');
  console.log(category);
  console.log('====================================');
  adminHelper.addCategory(category,(result) => {
    res.send(result);
  });
});
/**
 * ////////////////TODO:- admin can delete category-route/////////////
 * */

router.delete('/dashboard/deletecategory', (req, res) => {
  let id = req.query.id
  console.log(id);
  adminHelper.categoryRemove(id,(result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- admin have a permission to update category/////////////
 * */

router.put('/dashboard/editcategory', (req, res) => {
  adminHelper.categoryEdit(req.body, (result) => {
    console.log(result);
    res.send(result);
  });
});

module.exports = router;
