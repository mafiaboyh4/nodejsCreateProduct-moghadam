var express = require('express');
var router = express.Router();
const User = require('../models/user.model');
const ProjectModel = require('../models/project.model');

// لیست اصلی
router.get('/', function(req, res , next) {
  ProjectModel.find({} , function(err , response) {
    User.find({} , function(err , userData) {
      if (userData.length == 0) return  global.createUser((data) => {
        res.render('./pages/client/index.ejs',{ list:response , adminData:userData[0]});
      })
        res.render('./pages/client/index.ejs',{ list:response , adminData:userData[0]});
      
    })
  })
});

// نمایش تک صفحه ای
router.get('/postPreview/:id', function(req, res , next) {
  ProjectModel.findOne({_id:req.params.id} , function(err , response) {
    User.find({} , function(err , userData) {
      res.render('./pages/client/postPreview.ejs',{data:response , adminData:userData[0]});
    })
  })
});
// نمایش پروفایل
router.get('/myProfile', function(req, res , next) {
    User.find({} , function(err , userData) {
      res.render('./pages/client/profile.ejs',{ adminData:userData[0]});
    })
});


module.exports = router;
