const { log } = require("debug");
var express = require("express");
const app = require("../../app");
var router = express.Router();
const orderid = require("order-id")("eLibrary");
const id = orderid.generate();

const customerHelper = require("../../helpers/customer/customerHelper.js");

/**
 * ////////////////TODO:- Customer login form route/////////////
 * */

router.post("/login", (req, res) => {
  customerHelper.loginCredentials(req.body, (result) => {
    if (result.status === 200) {
    }

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
  responce;
});

/**
 * ////////////////TODO:- Customer view all product form route/////////////
 * */

router.get("/allProduct", (req, res) => {
  customerHelper.productDetails((result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Customer add to cart product route/////////////
 * */

router.post("/addtocart", (req, res) => {
  customerHelper.addToCart(req.body, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Customer view cart product route/////////////
 * */

router.get("/viewcart", (req, res) => {
  let customerName = req.query.customerName;
  // console.log(customerName);
  customerHelper.viewCart(customerName, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Customer view cart product route/////////////
 * */

router.put("/viewcart", (req, res) => {
  let { data, name } = req.body;
  // console.log(data, name);
  customerHelper.editViewCart(name, data, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Customer remove cart product route/////////////
 * */

router.delete("/viewcart", (req, res) => {
  let { customerName, id } = req.query;
  console.log(customerName, id);
  customerHelper.removeCartItem(customerName, id, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Customer remove all cart product route/////////////
 * */

router.delete("/viewcartRemoveAll", (req, res) => {
  let { customerName } = req.query;
  console.log(customerName, id);
  customerHelper.removeAllCartItem(customerName, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Customer checkout cart product route/////////////
 * */

router.get("/checkout", (req, res) => {
  let { customerName } = req.query;
  customerHelper.chekout(customerName, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Customer can edit shipAddress route/////////////
 * */

router.post("/editShipAddress", (req, res) => {
  let { customerName } = req.query;
  let data = req.body;
  customerHelper.editShipAddress(customerName, data, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Customer can edit shipAddress route/////////////
 * */

router.post("/placeOrder", (req, res) => {
  let orderId = Date.now();
  customerHelper.OrderHistory(orderId, req.body, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- Customer can edit shipAddress route/////////////
 * */

router.get("/accountInfo", (req, res) => {
  let { customerName } = req.query;
  customerHelper.CustomerDetails(customerName, (result) => {
    res.send(result);
  });
});

/**
 * ////////////////TODO:- customer edit account details-route/////////////
 * */

router.put("/accountInfo", (req, res) => {
  // let data = {
  //   bookImage: req.files[0],
  //   bookInfo: JSON.parse(req.body.bookInfo),
  // };
});

/**
 * ////////////////TODO:- Customer can view order route/////////////
 * */

router.get("/myOrder", (req, res) => {
  let name = req.query.customerName;
  customerHelper.myOrderList(name, (result) => {
    res.send(result);
  });
});

module.exports = router;
