var mongoose = require('mongoose');

var ProjectModelSchema = mongoose.Schema({  //model
    title : { type: String , require:true  },
    description : { type: String , require: true },
    images : { type: Array , require:true },
    technologies : { type: Array , default: false },
    liveDemo : { type: String , require:true },
    repository : { type: String , require:true },
    dateshmsi : String,
    created_at : Date,
    updated_at : Date
});

ProjectModelSchema.pre('save',function(next){ // save create at and updated at
    var currentDate = new Date();
    this.updated_at = currentDate;
    if(!this.created_at)
        this.created_at = currentDate;

    next();
});


var ProjectModel = mongoose.model('ProjectModel' , ProjectModelSchema);

module.exports = ProjectModel;
