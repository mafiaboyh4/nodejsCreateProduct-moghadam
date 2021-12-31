var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({  //model
    name : { type: String , require:true  ,unique: true},
    description : { type: String , require: true },
    link : { type: String , require:true },
    created_at : Date,
    updated_at : Date
});

UserSchema.pre('save',function(next){ // save create at and updated at
    var currentDate = new Date();
    this.updated_at = currentDate;

    if(!this.created_at)
        this.created_at = currentDate;

    next();
});


var User = mongoose.model('User' , UserSchema);

module.exports = User;
