const express = require('express');
const passport = require('passport');
const User = require('../controllers/user');
var router = express.Router();
const { dbUser } = require('../dbModels/user');
const { dbTmpUser, tmpValidate } = require('../dbModels/tmpUser');
const Joi = require('joi');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

router.get('/login/google/callback',passport.authenticate('google'),(req,res,next) =>{
    res.redirect('/');
});

router.get('/login/google',(req,res,next) =>{
  //  var loginGoogle = passport.authenticate('google',{ scope:['profile','email'] })
    
    passport.authenticate('google', { scope:['profile','email'] },function (err, user, info) {
        console.log('In google login ' + err);
        console.log('In google login ' + user);
        if (user) {
            // req.login(user, (err) => {
            //     console.log('Error ' + err);
            // })
            
             res.redirect('/');
        } else {
            res.send('fail');
        }
    })(req, res, next);
});


//router.post('/login',User.login);
router.post('/login', (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        if (user) {
            req.login(user, (err) => {
                console.log('fuck hell');
                res.redirect('/index')
            })

        } else {
            res.send('fail');
        }
    })(req, res, next);
})

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

router.get('/signup/verify/:token', async (req, res) => {
    token = req.params.token;
    try {
        let tmpuser = await dbTmpUser.findOne({ token: token });
        if (!tmpuser) {
            res.status(400).redirect('/');
        } else {
            res.render('signup.ejs', { token: token, email: tmpuser.email });
        }
    } catch (ex) {
        console.log("Exception in email verifiaction " + ex);
    }
})
router.post('/signup/checkEmailAvl', async (req, res) => {
    const email = req.body.email;

    let verify1 = validateEmail(email);
    let verify2;
    try {
        verify2 = await tmpValidate({ email: email });
    } catch (ex) {
        res.send(ex.details[0].message);
        console.log('Eror in validation ' + ex)
    }

    if (!verify1) {
        res.send('-1');
    } else {
        try {
            let dbuser = await dbUser.findOne({ email: email });
            console.log(dbuser);
            if (!dbuser) {
                let token = crypto.randomBytes(20).toString('hex');
                let params = {
                    email: email
                }
                update = { email: email, token: token, expiry: Date.now() + 60 * 60 * 1000 };
                options = { upsert: true, new: true, setDefaultsOnInsert: true };


                dbTmpUser.findOneAndUpdate(params, update, options, function (error, result) {
                    if (error) {
                        console.log("Error " + error);
                        res.status(500).send("Internal server error");
                    } else {
                        var transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: '587',
                            auth: {
                                user: 'hunteronline4477@gmail.com',
                                pass: 'rety34@47q'
                            },
                            secureConnection: 'false',
                            tls: {
                                ciphers: 'SSLv3'
                            }
                        });

                        // var transporter = nodemailer.createTransport({
                        //     host: "smtp-mail.outlook.com", // hostname
                        //     secureConnection: false, // TLS requires secureConnection to be false
                        //     port: 587, // port for secure SMTP
                        //     tls: {
                        //         ciphers: 'SSLv3'
                        //     },
                        //     requireTLS: true,//this parameter solved problem for me
                        //     auth: {
                        //         user: 'hotspotOnMNNIT@outlook.com',
                        //         pass: 'Rajjo@Paani'
                        //     }
                        // });

                        var mailOptions = {
                            to: email,
                            from: 'hunteronline4477@gmail.com',
                            subject: ' Authorization ',
                            text: 'This mail is for the confirmation for signup on MyVid.com \n\n' +
                                'Link Exprires in 1 hr \n\n' + 'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                                'http://' + req.headers.host + '/user/signup/verify/' + token + '\n\n' +
                                'If you did not request this, please ignore this email.\n'
                        };

                        transporter.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                console.log(err);
                                // res.send(err);
                            } else {
                                // res.send('message sent');
                                res.send('1');
                                console.log('sent');
                            }
                        });
                    }
                });
                res.send("1");
            } else {
                res.send('0');
            }
        } catch (ex) {
            console.log("Error " + ex);
            res.status(500).send("Internal server error");
        }
    }
});
router.post("/signup", User.signup);

router.get('/logout', User.logout);


module.exports = router;
