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


router.get('/account_info', currentUser ,function(req, res) {
  res.render('hitec/general/index', { 
      description: "",
      content: "Tienda Actual",
      title: "Historial del Usuario",
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

// to send messages to facebook
router.get('/login', function (req, res) {
  var currentUser = functionsDataGral.getCurrentUserObject(req);
  if(currentUser){
    res.redirect("/botsystem/");
  }else{
    res.render('BOTSystem/user/login', 
    { 
      description: "",
      content: "",
      title: "MeepLab",
      error: "0",
      errorType: "",
      flash: "",
      appId: ConfigAccountKit.APP_ID,
      csrf: csrf_guid,
      version: ConfigAccountKit.ACCOUNT_KIT_VERSION,
      tkn_fid: req.cookies.tkn_fid
    });
  }
});

/**
 * Logout, clear the cookies
 */
router.get('/logout', function (req, res) {
  res.clearCookie( 'tkn_fid');
  res.clearCookie( 'usr_fid');
  res.clearCookie( "usr_id" );
  
  res.redirect('/');
});


module.exports = router;