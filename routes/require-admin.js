var functionsDataGral = require('./../functions/general');
var request           = require('request');
var path              = require('path');
var app               = require(path.join(__dirname, '../index'));
var functionsDataGral = require(path.join(__dirname, '../functions/general'));

/*ACCOUNT KIT CONFIG BACKEND*/
//var csrf_guid = Guid.raw();
var csrf_guid         = app.csrf_guid;
var ConfigAccountKit  = require(path.join(__dirname, '../account_kit_config'));


// Use this middleware to require that a user is logged in
module.exports = function(req, res, next) {
  console.log("Revisando sesión de usuario");
  
  console.log(req.cookie);

  var tokenId = req.cookies.tkn_fid;
  var fbId    = req.cookies.usr_fid;

  if (tokenId && fbId) {
    request('https://graph.accountkit.com/v1.0/me/?access_token='+tokenId, function (error, response, body) {
      if(error){
        res.send({
          "data" : [],
          "message" : 'Authentication service Facing Down time',
          "status" : 500,
          "data_count" : 0
        });
      }
      else if(response.statusCode !== 200){
        res.send({
          "data" : [],
          "message" : 'Authentication failed',
          "status" : 500,
          "data_count" : 0
        });
      }
      else
      { 
        //here we got the Mobile Number -> Query DB -> identify the user to service
        var temp = JSON.parse(body);
        console.log("Salida request requireUser: "+temp);
        if(req.currentUser.get("type") === "ADMIN"){
          next();
        }else{
          res.send("No tienes permiso de ver esto");
        }
        
      }
    });
    //next();
  } else {
    res.send("No tienes permiso de ver esto");
    /*res.render('Yolollevo/error-page', {
  		title: "Principal", 
  		description:"", 
  		content:"Yo lo llevo",
  		error:"0",
  		errorType: "warning",
  		flash: "",
    	error_no: "401",
    	error_msg: "Accesso no autorizado"
  	});*/
  }
}