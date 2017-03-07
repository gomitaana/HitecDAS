var express           = require('express');
var router            = express.Router();
var path              = require('path');
var Request           = require('request');
var Guid              = require('guid');
var Querystring       = require('querystring');
var crypto            = require('crypto');
var CryptoJS          = require("crypto-js");
var app               = require(path.join(__dirname, '../index'));
var functionsDataGral = require(path.join(__dirname, '../functions/general'));
var currentUser       = require(path.join(__dirname, '/current-user'));
var requireAdmin      = require(path.join(__dirname, '/require-admin'));

router.get('/' ,function(req, res) {
  res.render('hitec/admin/brands', { 
      description: "",
      content: "Tienda Actual",
      title: "Usuarios",
      error: "0",
      errorType: "",
      flash: ""
    });
});

module.exports = router;