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
  res.render('TiendaActual/user/index', { 
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

router.get('/logout', function (req, res) {
  res.clearCookie( 'tkn_fid');
  res.clearCookie( 'usr_fid');
  res.clearCookie( "usr_id" );
  
  res.redirect('/');
});

router.post('/checkoutAddress', function (req, res) {
  var currentUser = functionsDataGral.getCurrentUserObject(req);
  var idPurchase  = req.body.purchase;
  var name        = req.body.firstname;
  var lastname    = req.body.lastname;
  var street      = req.body.street;
  var city        = req.body.city;
  var zip         = req.body.zip;
  var state       = req.body.state;
  var tel         = req.body.tel;
  var email       = req.body.email;

  res.render('TiendaActual/user/checkoutAddress', { 
      description: "",
      content: "Tienda Actual",
      title: "Carrito de compras",
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

router.get('/basket', currentUser ,function(req, res) {
  res.render('TiendaActual/user/basket', { 
      description: "",
      content: "Tienda Actual",
      title: "Carrito de compras",
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

router.post('/checkoutPayment', function (req, res) {
  var currentUser = functionsDataGral.getCurrentUserObject(req);
  res.render('TiendaActual/user/checkoutPayment', { 
      description: "",
      content: "Tienda Actual",
      title: "Carrito de compras",
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

router.post('/checkoutReview', function (req, res) {
  var currentUser = functionsDataGral.getCurrentUserObject(req);
  res.render('TiendaActual/user/checkoutReview', { 
      description: "",
      content: "Tienda Actual",
      title: "Carrito de compras",
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