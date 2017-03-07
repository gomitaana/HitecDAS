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

/*ACCOUNT KIT CONFIG BACKEND*/
//var csrf_guid = Guid.raw();
var csrf_guid         = app.csrf_guid;
var ConfigAccountKit  = require(path.join(__dirname, '../account_kit_config'));


module.exports = router;