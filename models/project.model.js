var mongoose = require('mongoose');
const jal = require('jalali-date');

var ProjectModelSchema = mongoose.Schema({  //model
    title : { type: String , require:true  },
    description : { type: String , require: true },
    images : { type: Array , require:true },
    technologies : { type: Array , default: false },
    dateshmsi : String,
    created_at : Date,
    updated_at : Date
});

ProjectModelSchema.pre('save',function(next){ // save create at and updated at
    var currentDate = new Date();
    var DateN = new Date(Date.now());
    var Shamsi = new jal(DateN);
    var AddShamsi = Shamsi.date[0]+'/'+Shamsi.date[1]+'/'+Shamsi.date[2];

    this.updated_at = currentDate;
    this.dateshmsi = AddShamsi.toString();

    if(!this.created_at)
        this.created_at = currentDate;

    next();
});


var ProjectModel = mongoose.model('ProjectModel' , ProjectModelSchema);

module.exports = ProjectModel;
