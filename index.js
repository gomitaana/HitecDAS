var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var http = require('http');
var path = require('path');
var expressLayouts = require('express-ejs-layouts');
var moment = require('moment');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var config = require(__dirname + '/configuracion.json');
var ParseDashboard = require('parse-dashboard');
var helmet = require('helmet');
var morgan = require("morgan");
var cookieParser = require('cookie-parser');
var CryptoJS = require("crypto-js");
var Guid = require('guid');
var Querystring  = require('querystring');
var Request  = require('request');
var crypto = require('crypto');
var requireUser = require(path.join(__dirname, '/routes/require-user'));

/*********************************************/
/******************CONFIG*********************/
/*********************************************/
var portApp = 0;
var dataBaseName = "HiTec";
if(config.production == "true"){
  //Produccion
    portApp = 3016;
}else if(config.production == "false"){
  //Desarrollo
    portApp = 3015;
}

/*********************************************/
/*********************************************/
/*******************PARSE*********************/
var databaseUri = process.env.DATABASE_URI || process.env.MONGOLAB_URI;
if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}
var databaseUri = 'mongodb://meeplab:4BPNSdISUd5u1K29@cluster0-shard-00-00-pxvyx.mongodb.net:27017,cluster0-shard-00-01-pxvyx.mongodb.net:27017,cluster0-shard-00-02-pxvyx.mongodb.net:27017/'+ dataBaseName +'?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'
console.log(databaseUri);
var api = new ParseServer({
  databaseURI: databaseUri,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || 'myMasterKey', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:' + portApp + '/parse',  // Don't forget to change to https if needed,
});
/*************************************************/
/*************************************************/
/*******************DASHBOARD*********************/
if(config.production == "false"){
  var allowInsecureHTTP = true;
  var dashboard = new ParseDashboard({
    "apps": [
      {
        "serverURL": "http://159.203.126.20:"+portApp+"/parse",
        "appId": "myAppId",
        "masterKey": "myMasterKey",
        "appName": "HiTec"
      }
    ],
      "users": [
      {
        "user":"meeplab",
        "pass":"meeplab4all!"
      },
      {
        "user":"admin",
        "pass":"hitec"
      }
    ]
  }, allowInsecureHTTP);
}

var app = express();

app.use(morgan('dev'));
// Serve static assets from the /public folder
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/public', express.static(path.join(__dirname, '/public')));
app.set('views', 'cloud/views');
app.set('view engine', 'ejs');  
app.use(expressLayouts);
app.use(methodOverride());
app.use(bodyParser.json());                        
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
app.use(bodyParser.text({ type: 'text/html' }))
app.locals._ = require('underscore');
app.use(helmet());
app.use(cookieParser());

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);


app.get('/', function(req, res) {
  res.render('hitec/general/login', 
  { 
    description:"",
    content: "HiTec",
    title: "Login",
    error: "0",
    errorType: "",
    flash: "",
  });
});

app.post('/login',function(request, response){
  response.redirect("./admin");
});

var user = require(path.join(__dirname, '/routes/user'));
app.use('/user', user);

if(config.production == "false"){
  app.use('/dashboard', dashboard);
}

console.log("Iniciando Server");

var port = process.env.PORT || portApp;
var httpServer = require('http').createServer(app);
httpServer.listen(portApp, function() {
    console.log('parse-server-example running on port ' + portApp + '.');
});