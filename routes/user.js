var express = require('express');
var router = express.Router();
const User = require('../models/user.model');
const ProjectModel = require('../models/project.model');

// لاگین
router.post('/login', function(req, res , next) {
  if(req.body.email && req.body.password ) {
    User.findOne({email:req.body.email , password: req.body.password}, function(err,user) {
      if(!err && user) {
        res.send(user)
      } else {
        const data = {
          msg: "نام کاربری یا پسورد اشتباه است"
        }
        const jsonStr = JSON.stringify(data);
        res.send(jsonStr);
      }
    })
  }
});


// لیست اصلی
router.get('/', function(req, res , next) {
  res.render('./pages/client/index.ejs',{});
});

// نمایش تک صفحه ای
router.get('/postPreview', function(req, res , next) {
  res.render('./pages/client/postPreview.ejs',{});
});

// ساخت پروژه جدید
router.post('/createProject', function(req, res , next) {
  if(req.body.title && req.body.description && req.body.links.length == 3 ) {
    let newProject = new ProjectModel({
      title:req.body.title,
      description:req.body.description,
      links:req.body.links
    });
    newProject.save().then((proj)=>{
    if (proj) {
      console.log(proj);
    }});
  }
});

// لیست پروژه ها
router.get('/projects', function(req, res , next) {
  ProjectModel.find({} , function(err,projectRes) {
    console.log(projectRes);
  });
});

// گرفتن یک پروژه خاص
router.get('/projects', function(req, res , next) {
  if (req.params.id) {
    ProjectModel.findOne({id:req.params.id} , function(err,projectRes) {
      console.log(projectRes);
    });
  }
});

// اپدیت پروژه
router.put('/updateProject', function(req, res , next) {
  if (req.params.id) {
    ProjectModel.findOneAndUpdate({_id:user._id} , req.body , function(err,response) {
      console.log(response);
    });
  }
});

// حدف پروژه
router.put('/deleteProject', function(req, res , next) {
  if (req.params.id) {
  }
});


module.exports = router;
