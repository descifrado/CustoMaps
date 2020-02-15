const mongoose = require('mongoose'),
    Joi = require('joi'),  //for validating
    jwt = require('jsonwebtoken'),
    config = require('config'),
    bcrypt = require('bcrypt-nodejs')
  
const userSchema = new mongoose.Schema({
    name:{type: String ,
        required: true ,
        minlength:5,
        maxlength:250,
        lowercase:true
    },
    email:{type: String ,
        required: true,
        trim:true,  //to remove paddings
        unique: true,
    },
    username:{type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 200,
    },
    password:{type: String,
        required: true,
        type: String,
    },
    contactNo:{
        type: Number,
    },
    date:{type: Date, default: Date.now},
    isAdmin:{
        type:Boolean,
        default:false
    },
    googleid:{
        type:String
    },
    token:{
        token:String,
        time:Number
    },
    fav_users:{
        type:[Object],
        default:undefined
    }               
});

// userSchema.methods.generateAuthToken = function(){
//     const token = jwt.sign({_id:this._id,name:this.name,isAdmin:this.isAdmin},config.get('jwtPrivateKey')); // the actual value is in environment variable
//     return token;
// }
userSchema.methods.hashPassword = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
}

userSchema.methods.comparePassword = function(password,hash){
    return bcrypt.compareSync(password,hash);
}

const User = mongoose.model('User',userSchema);  // 1st arg is the singular object in database 2nd is Schema

function validate(user){
    const schema = {
        username: Joi.string().min(5).max(500).required(),
        email: Joi.string().min(8).max(50).required(),
        password: Joi.string().min(5).max(50).required(),
        contactNo:Joi.string().min(10).max(10),
        name:Joi.string().min(5).max(50).required(),
        token : Joi.string().min(40).max(40).required()
    };
    return Joi.validate(user,schema);
}



//User.prototype.signup = signup;
// User.prototype.validate = validate;

//module.exports = User;
exports.dbUser = User;
exports.validate = validate;
