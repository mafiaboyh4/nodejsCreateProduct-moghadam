var createError = require('http-errors');
const mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyparser = require('body-parser');   
var cors = require('cors');
var session = require('express-session');
var UserRouter = require('./routes/user');
var adminRouter = require('./routes/admin.route');
const config = require('./config/database');
const fileUpload = require('express-fileupload');
const expressValidator = require('express-validator');
const  User  = require('./models/user.model');
var app = express();
app.use(cors({origin: "*"})); 

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.connect(config.database);
const db = mongoose.connection;

db.once('open', function(){
  console.log('Connected to MongoDB');
});
db.on('error', function(err){
  console.error(err);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());

app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, '../front/dist/test-osm')));

app.use(bodyparser.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use('/', UserRouter);
app.use('/admin/', adminRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});


global.checkuser = function(username , password , callback) {
  try {
    User.findOne({username:username , password:password}).then((user) =>{
      if (user) {
        return callback(user);
      } else {
        const data = {
          msg: "نام کاربری یا پسورد اشتباه است"
        }
        const jsonStr = JSON.stringify(data);
        
        return callback(jsonStr);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = app;
