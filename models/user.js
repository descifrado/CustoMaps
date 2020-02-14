const { dbUser, validate } = require('../dbModels/user');
const { dbTmpUser, tmpValidate } = require('../dbModels/tmpUser');


function User(params) {
    this.name = params.name;
    this.email = params.email;
    this.username = params.username;
    this.password = params.password;
    this.contactNo = params.contactNo;
    this.token = params.token;
};

User.prototype.signup = async function (newUser) {
    // dbUser validation and return the corresponding error
    const error = validate(newUser);
    //console.log(dbUser.hashPassword);
    if (error.error) {
        return { code: 0, err: error.error.details[0].message };
    }
    try {
        var dbuser = await dbUser.findOne({ email: this.email })  // returns an array and hence dbuser[0]
        if (dbuser) {
            return { code: -1, err: "User already exists" };
        } else {
            let tmpuser = await dbTmpUser.findOne({ token: this.token });
            if (!tmpuser) {
                return { code: -1, err: 'Invalid token' };
            } else if (tmpuser.expiry < Date.now()) {
                return { code: -1, err: 'Token Expired try again' };
            } else {
                let result = await dbTmpUser.findOneAndRemove({ token: this.token });
                if (!result) {
                    return { code: -1, err: 'Internal server error' }
                } else {
                    dbuser = new dbUser({
                        name: this.name,
                        email: this.email,
                        username: this.username,
                    });
                    dbuser.password = dbuser.hashPassword(this.password);
                    let user = await dbuser.save();
                    
                    return { code: 1 };
                }
            }

        }
    } catch (ex) {
        console.log(ex);
        return { code: -1, err: 'Internal Server Error' };
    }

}


User.prototype.login = function (req, res, next) {
    // be careful this fucking passport.authenticate returns a function which needs to be called
    passport.authenticate('local', function (err, user, info) {
        if (user) {
            res.redirect('/user/dashboard');
        } else {
            res.send(info).redirect('/');
        }
    })(req, res, next);
}


User.prototype.logout = function (req, res, next) {
    req.logout();
    res.redirect('/');
};


User.prototype.constructor = User;
module.exports = User;
