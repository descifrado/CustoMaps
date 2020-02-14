const mongoose = require('mongoose'),
    crypto = require('crypto')


const forgotSchema = new mongoose.Schema({
    email:{type: String ,
        required: true,
        trim:true,  //to remove paddings
        unique: true,
    },
    date:{type: Number},
    token:{
        type : String
    }               
});

forgotSchema.methods.getToken = function(){
    return crypto.randomBytes(20).toString('hex');
}

const Forgot = mongoose.model('Forgot',forgotSchema);  // 1st arg is the singular object in database 2nd is Schema
//console.log(Forgot.getToken());
module.exports = Forgot;