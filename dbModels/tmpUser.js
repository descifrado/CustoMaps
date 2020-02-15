const mongoose = require('mongoose'),
    Joi = require('joi')
  
const tmpUserSchema = new mongoose.Schema({
   token : {
       type : String,
       required : true
   },
   email : {
       type : String,
       required : true
   },
   expiry : {
       type : Date,
       default : Date.now() + 30*60*60
   }
});



const TmpUser = mongoose.model('TmpUser',tmpUserSchema);  // 1st arg is the singular object in database 2nd is Schema

function tmpValidate(email){
    const schema = {
        email: Joi.string().min(8).max(50).required()
    };
    return Joi.validate(email,schema);
}



//User.prototype.signup = signup;
// User.prototype.validate = validate;

//module.exports = User;
exports.dbTmpUser = TmpUser;
exports.tmpValidate = tmpValidate;
