var mongoose = require('mongoose');
const jal = require('jalali-date');

var UserSchema = mongoose.Schema({  //model
    email : { type: String , require:true ,  unique: true },
    password : { type: String , require: true },
    phone : { type: String , require:true ,  unique: true},
    isAdmin : { type: Boolean , default: false },
    active : { type: Boolean , default: false },
    code : { type: String },
    codeWrong:{type:Number,default:0},
    numberOfSmsSent:{type:Number,default:1},
    dateshmsi : String,
    created_at : Date,
    updated_at : Date
});

UserSchema.pre('save',function(next){ // save create at and updated at
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


var User = mongoose.model('User' , UserSchema);

module.exports = User;
