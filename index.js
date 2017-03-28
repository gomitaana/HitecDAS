var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var http = require('http');
var path = require('path');
var expressLayouts = require('express-ejs-layouts');
var moment = require('moment');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser     = require('body-parser');
var multer         = require('multer');
var config         = require(__dirname + '/configuracion.json');
var ParseDashboard = require('parse-dashboard');
var helmet         = require('helmet');
var morgan         = require("morgan");
var cookieParser   = require('cookie-parser');
var CryptoJS       = require("crypto-js");
var Guid           = require('guid');
var Querystring    = require('querystring');
var Request        = require('request');
var crypto         = require('crypto');
var requireUser    = require(path.join(__dirname, '/routes/require-user'));
var currentUser    = require(path.join(__dirname, '/routes/current-user'));

/*ACCOUNT KIT CONFIG BACKEND*/
var csrf_guid         = Guid.raw();
exports.csrf_guid     = csrf_guid;
var ConfigAccountKit  = require(path.join(__dirname, '/account_kit_config'));

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
var databaseUri = 'mongodb://104.236.11.124:27017/'+dataBaseName
//MongoDB://hello@world.com:pass@mydomain.com:port/path
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
        "serverURL": "http://104.236.11.124:"+portApp+"/parse",
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

/**
 * Main function
 * Render the index
 */
app.get('/', function(req, res) {
  res.render('hitec/general/index', 
  { 
    description:"",
    content: "HiTec",
    title: "Pase de lista",
    error: "0",
    errorType: "",
    flash: "",
    students:"",
    appId: ConfigAccountKit.APP_ID,
    csrf: csrf_guid,
    version: ConfigAccountKit.ACCOUNT_KIT_VERSION,
    currentUser: req.currentUser,
    tkn_fid: req.cookies.tkn_fid,
    usr_fid: req.cookies.usr_fid,
  });
});

/**
 * Birthday get the list of students
 * Render birthday
 */

app.get('/birthday', function(req, res) {
  var Students = Parse.Object.extend("students");
  var query = new Parse.Query(Students);
  query.equalTo("assistance",true);

  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  query.lessThan("birthday", firstDay);
  query.greaterThan("birthday", lastDay);

  query.find({
    success: function(results) {
      res.render('hitec/general/birthday', 
      { 
        description:"",
        content: "HiTec",
        title: "Cumpleaños",
        error: "0",
        errorType: "",
        flash: "",
        students:results,
        appId: ConfigAccountKit.APP_ID,
        csrf: csrf_guid,
        version: ConfigAccountKit.ACCOUNT_KIT_VERSION,
        currentUser: req.currentUser,
        tkn_fid: req.cookies.tkn_fid,
        usr_fid: req.cookies.usr_fid,
      });
    },
    error: function(error) {
      console.log("Error: " + error.code + " " + error.message);
    }
  });
});

/**
 * Search by lasname or id
 * Render index
 *@param {sting} option
 *@param {sting} search
 */
app.get('/search', function(req, res) {
  var option = req.query.radios;
  var search = req.query.search;

  var Students = Parse.Object.extend("students");
  var query = new Parse.Query(Students);
  if(option == "matricula"){
    query.equalTo("matricula", search);
  }else{
    var patt = new RegExp(search,"i");
    query.matches("lastname",patt);
  }

  query.find({
    success: function(results) {
      res.render('hitec/general/index', 
      { 
        description:"",
        content: "HiTec",
        title: "Pase de lista",
        error: "0",
        errorType: "",
        flash: "",
        students:results,
        appId: ConfigAccountKit.APP_ID,
        csrf: csrf_guid,
        version: ConfigAccountKit.ACCOUNT_KIT_VERSION,
        currentUser: req.currentUser,
        tkn_fid: req.cookies.tkn_fid,
        usr_fid: req.cookies.usr_fid,
      });

    },
    error: function(error) {
      console.log("Error: " + error.code + " " + error.message);
    }
  });
});

/**
 * Select a random team
 * Render index
 *@param {sting} id
 *
 */
app.get('/selectTeam', function(req, res) {
  var id = req.query.student;

  var Students = Parse.Object.extend("students");
  var studentQry = new Parse.Query(Students);
  studentQry.equalTo("objectId",id);

  var Teams = Parse.Object.extend("teams");
  var query = new Parse.Query(Teams);
  query.ascending("actualNumber");

  query.first({
    success: function(team) {
      console.log(team.get('color')+team.get('teamNumber'));
      studentQry.first({
        success: function(student) {
          var actualNumber = Number(team.get('actualNumber')) + 1;
          team.set("actualNumber", actualNumber);

          student.set("color",team.get('color'));
          student.set("teamnumber",team.get('teamNumber'));
          student.set("assistance",true);

          var data = [];
          data[0]=student;
          Parse.Object.saveAll([team, student], {
            success: function(list) {
              res.render('hitec/general/index', 
              { 
                description:"",
                content: "HiTec",
                title: "Pase de lista",
                error: "0",
                errorType: "",
                flash: "",
                students:data,appId: ConfigAccountKit.APP_ID,
                csrf: csrf_guid,
                version: ConfigAccountKit.ACCOUNT_KIT_VERSION,
                currentUser: req.currentUser,
                tkn_fid: req.cookies.tkn_fid,
                usr_fid: req.cookies.usr_fid,
              });
            },
            error: function(error) {
              // An error occurred while saving one of the objects.
              console.log("Error: " + error.code + " " + error.message);
            },
          });
        },
        error: function(error) {
          console.log("Error: " + error.code + " " + error.message);//error student
        }
      });
    },
    error: function(error) {
      console.log("Error: " + error.code + " " + error.message);//Team error
    }
  });
});

/**
 * Show the form to add a student
 *Render addStudent
 */
app.get('/addStudent', function(req, res) {
  res.render('hitec/general/addStudent', 
  { 
    description:"",
    content: "HiTec",
    title: "Agregar alumno",
    error: "0",
    errorType: "",
    flash: "",
    students:"",
    appId: ConfigAccountKit.APP_ID,
    csrf: csrf_guid,
    version: ConfigAccountKit.ACCOUNT_KIT_VERSION,
    currentUser: req.currentUser,
    tkn_fid: req.cookies.tkn_fid,
    usr_fid: req.cookies.usr_fid,
  });
});

/**
 * Save the new record
 * Render index
 *@param {sting} matricula
 *@param {sting} name
 *@param {sting} lastname
 *@param {sting} parents
 *@param {sting} birthday
 */
app.post('/saveStudent' ,function(req, res) {
    var Students = Parse.Object.extend("students");
    var student = new Students();

    student.set("matricula", req.body.matricula);
    student.set("name", req.body.name);
    student.set("lastname", req.body.lastname);
    student.set("lastName", req.body.lastName);
    student.set("parents", Number(req.body.radios));
    var today = new Date();

    if(req.body.date){
      var date = today.getFullYear()+"-"+req.body.date;
      var d = new Date(date);
      student.set("birthday", d);
    }
    student.set("assistance", false);

    student.save(null, {
      success: function(student) {
        console.log('New object created with objectId: ' + student.id);
        var data = [];
        data[0]=student;
        res.render('hitec/general/index', 
        { 
          description:"",
          content: "HiTec",
          title: "Pase de lista",
          error: "0",
          errorType: "",
          flash: "",
          students:data,
          appId: ConfigAccountKit.APP_ID,
          csrf: csrf_guid,
          version: ConfigAccountKit.ACCOUNT_KIT_VERSION,
          currentUser: req.currentUser,
          tkn_fid: req.cookies.tkn_fid,
          usr_fid: req.cookies.usr_fid,
        });
      },
      error: function(student, error) {
        console.log('Failed to create new object, with error code: ' + error.message);
      }
    }); 
});

/**
 * Send the code to the API of facebook
 * Render admin
 */
app.post('/sendcode',function(request, response){
  console.log("CSRF REQ->" + request.body.csrf_nonce);
  console.log("CSRF->" + csrf_guid);
  // CSRF check
  if (request.body.csrf_nonce === csrf_guid) {
    var app_access_token = ['AA', ConfigAccountKit.APP_ID, ConfigAccountKit.APP_SECRET].join('|');
    var params = {
      grant_type: 'authorization_code',
      code: request.body.code,
      access_token: app_access_token
    };
  
    // exchange tokens
    var token_exchange_url = ConfigAccountKit.TOKEN_EXCHANGE_BASE_URL + '?' + Querystring.stringify(params);
    Request.get({url: token_exchange_url, json: true}, function(err, resp, respBody) {
      console.log(respBody);
      
      var user_access_token = respBody.access_token;
      var expires_at = respBody.expires_at;
      var user_id = respBody.id; 
      var phone_num;
      var email_addr;

      // get account details at /me endpoint
      var appsecret_proof = crypto.createHmac('sha256', ConfigAccountKit.APP_SECRET)
                   .update(user_access_token)
                   .digest('hex');
      var me_endpoint_url = ConfigAccountKit.ME_ENDPOINT_BASE_URL + '?appsecret_proof=' + appsecret_proof + '&access_token=' + respBody.access_token;
      Request.get({url: me_endpoint_url, json:true }, function(err, resp, respBody) {
        //console.log(respBody)
        // send login_success.html
        if (respBody.phone) {
          phone_num = respBody.phone.number;
          console.log("Tel: " + phone_num);
        } else if (respBody.email) {
          email_addr = respBody.email.address;
          console.log("Correo: " + email_addr);
        }

        var ciphertext = CryptoJS.AES.encrypt(user_id, ConfigAccountKit.SECRET_KEY_USERS);
        
        var UsersSystem = Parse.Object.extend("UsersSystem");
        var query = new Parse.Query(UsersSystem);
        query.equalTo("email", email_addr);
        query.first({
          success: function(user) {
            console.log("Regreso query");
            if(user){
              console.log("User ya existia->" + user.id);
              
              if(user.get("type") === "ADMIN"){
                console.log("PERMISOS NECESARIOS");
                user.set("username", user_id);
                user.set("token", user_access_token);
                user.set("password", ciphertext.toString());
                user.set("email", email_addr);
                user.save(null, {
                  success: function(user) {
                    response.cookie("tkn_fid" , user_access_token, {secure:false});
                    response.cookie("usr_fid" , user_id, {secure:false});
                    response.cookie("usr_id" , user.id, {secure:false});
                    response.redirect("/admin");
                  },
                  error: function(user, error) {
                    console.log("Error: " + error.code + " " + error.message);
                    response.redirect("/");
                  }
                });
              }else{
                console.log("SIN PERMISOS");
                response.redirect("/");
              }
            }else{
              console.log("No User");
              response.redirect("/");
            }
          },
          error: function(user, error) {
            console.log("Error: " + error.code + " " + error.message);      
            response.redirect("/");
          }
        });
      });
    });
  } 
  else {
    // login failed
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end("Something went wrong. :( ");
  }
});

var user = require(path.join(__dirname, '/routes/user'));
app.use('/user', user);
var admin  = require(path.join(__dirname, '/routes/admin'));
app.use('/admin', admin);

if(config.production == "false"){
  app.use('/dashboard', dashboard);
}

/**********************************************************/
/*********************Controlers************************/
/**********************************************************/
var admin  = require(path.join(__dirname, '/routes/admin'));
app.use('/admin', admin);

if(config.production == "false"){
  app.use('/dashboard', dashboard);
}

console.log("Iniciando Server");


var port = process.env.PORT || portApp;
var httpServer = require('http').createServer(app);
httpServer.listen(portApp, function() {
    console.log('parse-server-example running on port ' + portApp + '.');
});