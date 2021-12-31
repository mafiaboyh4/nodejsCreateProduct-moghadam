var express = require('express');
var router = express.Router();
const User = require('../models/user.model');
const ProjectModel = require('../models/project.model');
const { mkdir } = require('fs-extra');
var fs = require('fs');

router.get('/', function(req, res , next) {
 res.render('pages/admin/listProject',{});
});

router.get('/createProject', function(req, res , next) {
 res.render('pages/admin/createProject',{});
});

// اپلود عکس های پروژه
router.post('/uploadImages', function(req, res) {
  let sampleFile;
  let uploadPath;
  if (!req.files || Object.keys(req.files).length === 0) return res.status(400).send('No files were uploaded.');
  let list = [];
  if (req.files['images[]'].length > 1) {
    list = req.files['images[]'];
  } else {
    list.push(req.files['images[]']);
  }

  var id = Math.floor(Math.random() * 100000);
  mkdir(`public\\images\\projectImages\\${id}`);
  var links = [];
  for (let i = 0; i < list.length; i++) {
    try {
      sampleFile = list[i];
      uploadPath = "public\\images\\projectImages\\" + id + '\\' +  sampleFile.name;
      
      sampleFile.mv(uploadPath, function(err) {
            if (err) return res.status(500).send(err);
            links.push(id + '/' +  sampleFile.name);

            if (links.length == list.length) {
              const data = {
                links:links
              }
              const jsonStr = JSON.stringify(data);
              res.send(jsonStr)
            }
      });
    } catch (error) {
      
    }
  }
});

// اپلود عکس پروفایل
router.post('/uploadProfileImages', function(req, res) {
  let sampleFile;
  let uploadPath;
  if (!req.files || Object.keys(req.files).length === 0) return res.status(400).send('No files were uploaded.');

  const path = "public\\images\\profile\\profile.png";
  sampleFile = req.files['profile'];
    uploadPath = path;
    
    sampleFile.mv(uploadPath, function(err) {
        if (err) return res.status(500).send(err);
          const data = {
            status:200
          }
          const jsonStr = JSON.stringify(data);
          res.send(jsonStr);
    });
  
});

// گرفتن اطلاعات کاربر
router.get('/getUserData', function(req, res , next) {
  User.find({} , function(err , userData) {
    res.send(userData[0])
  })
 });

// رندر آپدیت پروفایل
router.get('/updateUser', function(req, res , next) {
  res.render('pages/admin/updateUser',{});
 });


// اپدیت پروفایل
router.put('/updateProfile', function(req, res , next) {
  if (req.body) {
    User.find({} , function(errorFind , resFind) {
      User.findOneAndUpdate({_id:resFind[0]._id} , {$set:req.body} , function(err,response) {
        res.send(response)
      });
    })
  }
});


// ساخت کاربر جدید
router.post('/createUser', function(req, res , next) {
  if(req.body.name && req.body.description && req.body.link ) {
    let newUser = new User({
      name:req.body.name,
      description:req.body.description,
      link:req.body.link,
    });
    newUser.save().then((proj)=>{
    if (proj) {
      const data = {
        status:200
      }
      const jsonStr = JSON.stringify(data);
      res.send(jsonStr)
    }});
  }
});

// ساخت پروژه جدید
router.post('/createProject', function(req, res , next) {
  if(req.body.title && req.body.description && req.body.images.length > 0 && req.body.technologies.length > 0) {
    let newProject = new ProjectModel({
      title:req.body.title,
      description:req.body.description,
      images:req.body.images,
      technologies:req.body.technologies
    });
    newProject.save().then((proj)=>{
    if (proj) {
      const data = {
        status:200
      }
      const jsonStr = JSON.stringify(data);
      res.send(jsonStr)
    }});
  }
});

// لیست پروژه ها
router.get('/projects', function(req, res , next) {
  ProjectModel.find({} , function(err,projectRes) {
    res.send(projectRes);
  });
});

// گرفتن یک پروژه خاص
router.get('/project/:id', function(req, res , next) {
  if (req.params.id) {
    ProjectModel.findOne({_id:req.params.id} , function(err,projectRes) {
      if (projectRes) res.send(projectRes)
       else res.send(null)
    });
  }
});


//حذف عکس 
router.post('/removeProjectImage', function(req, res , next) {
  console.log(req.body);
  fs.unlinkSync('public\\images\\projectImages\\' + req.body.name);
    ProjectModel.findOneAndUpdate({_id:req.body.id} , {$set:{images:req.body.images}} , {new: true}, (err, doc) => {
      if (err) {
          console.log("Something wrong when updating data!");
      }
      res.send(doc);
    });
});

// رندر اپدیت پروژه
router.get('/updateProject/:id' , function(req,res) {
  res.render('pages/admin/updateProject' , {} )
})

// اپدیت پروژه
router.put('/updateProject/:id', function(req, res , next) {
  console.log(req.body);
  if (req.body) {
    ProjectModel.findOneAndUpdate({_id:req.params.id} , {$set:req.body} , function(err,response) {
      res.send(response)
    });
  }
});

// حدف پروژه
router.delete('/deleteProject/:id', function(req, res , next) {
  if (req.params.id) {
    ProjectModel.findOneAndRemove({_id:req.params.id} ,function(err,response) {
      const data = {
        status:200
      }
      const jsonStr = JSON.stringify(data);
      res.send(jsonStr)
    });
  }
});


module.exports = router;
