var express           = require('express');
var router            = express.Router();
var path              = require('path');
var Request           = require('request');
var Guid              = require('guid');
var Querystring       = require('querystring');
var crypto            = require('crypto');
var CryptoJS          = require("crypto-js");
var multer            = require('multer');
var app               = require(path.join(__dirname, '../index'));
var functionsDataGral = require(path.join(__dirname, '../functions/general'));
var currentUser       = require(path.join(__dirname, '/current-user'));
var requireAdmin      = require(path.join(__dirname, '/require-admin'));

/*ACCOUNT KIT CONFIG BACKEND*/
//var csrf_guid = Guid.raw();
var csrf_guid         = app.csrf_guid;
var ConfigAccountKit  = require(path.join(__dirname, '../account_kit_config'));

/**
 * Redirect to the dashboard
 */
router.get('/' ,function(req, res) {
  res.redirect("/admin/dashboard");
});

/**
 * Shows the main window of the admin
 */
router.get('/dashboard' ,function(req, res) {
  res.render('hitec/admin/dashboard', { 
      description: "",
      content: "Administrador",
      title: "Dashboard",
      error: "0",
      errorType: "",
      flash: "",
      appId: ConfigAccountKit.APP_ID,
      csrf: csrf_guid,
      version: ConfigAccountKit.ACCOUNT_KIT_VERSION,
      currentUser: req.currentUser,
      tkn_fid: req.cookies.tkn_fid,
      usr_fid: req.cookies.usr_fid
    });
});

/**
 * Show all the actual Capitans of the teams
 */
router.get('/capitans' ,function(req, res) {
  res.render('hitec/admin/capitans', { 
      description: "",
      content: "Administrador",
      title: "Dashboard",
      error: "0",
      errorType: "",
      flash: "",
      appId: ConfigAccountKit.APP_ID,
      csrf: csrf_guid,
      version: ConfigAccountKit.ACCOUNT_KIT_VERSION,
      currentUser: req.currentUser,
      tkn_fid: req.cookies.tkn_fid,
      usr_fid: req.cookies.usr_fid
    });
});

/**
 * Shows all the students
 */
router.get('/students' ,function(req, res) {
  res.render('hitec/admin/students', { 
      description: "",
      content: "Administrador",
      title: "Dashboard",
      error: "0",
      errorType: "",
      flash: "",
      appId: ConfigAccountKit.APP_ID,
      csrf: csrf_guid,
      version: ConfigAccountKit.ACCOUNT_KIT_VERSION,
      currentUser: req.currentUser,
      tkn_fid: req.cookies.tkn_fid,
      usr_fid: req.cookies.usr_fid
    });
});

module.exports = router;