const express = require('express'),
    dbForgot = require('../dbModels/forgot'),
    { dbUser } = require('../dbModels/user'),
    nodemailer = require('nodemailer'),
    router = express.Router()


router.get('/', (req, res) => {
    //res.render('forgot.ejs');
    // dbforgot = new dbForgot();
    // console.log(dbforgot.getToken());
    res.send('forgot');
});

router.get('/reset/:token', async (req, res, next) => {
    const token = req.params.token;
    try {
        let dbforgot = await dbForgot.findOne({ token: token });
        if (!dbforgot) {
            res.status(400).send("Unauthorized access");
        } else {
            if (dbforgot.date < Date.now()) {
                res.send("Token Expired");
            } else {
                res.render('reset.ejs', { token: token });
            }
        }
    } catch (ex) {
        console.log(ex);
        res.status(500).send("Internal Server error");
    }
});

router.post('/reset', async (req, res, next) => {
    const token = req.body.token;
    if (!token || !req.body.password) {
        res.status(400).send({ code: -1, err: 'Invalid request' });
    }

    try {
        let dbforgot = await dbForgot.findOne({ token: req.body.token });
        if (!dbforgot) {
           // res.redirect('/');
           res.send("11");
        } else {
            let time1 = dbforgot.date;
            if (Date.now() > time1) {
                res.status(408).send('too late token expired');
            } else {
                let dbuser = await dbUser.findOne({ email: dbforgot.email });
                let password = dbuser.hashPassword(req.body.password);
                dbuser.password = password;
                let result = await dbuser.save();
                let err = await dbforgot.remove({ token: token });
                res.send({ code: 1, msg: 'success' });
            }
        }
    } catch (err) {
        console.log('Error occured ' + new Error());
        res.status(500).send({ code: -1, err: 'Internal Server error' });
    }

});

router.post('/emailVerification', async (req, res, next) => {
    const email = req.body.email;
    if (!email) {
        res.status(400).send({ code: -1, message: 'Email cannot be empty' });
    }
    let dbuser = await dbUser.findOne({ email: email });
    if (!dbuser) {
        res.send({ code: -1, message: 'user doesn exist' });
    } else {

        try {
            let temp = new dbForgot();
            const token = temp.getToken();
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

            var mailOptions = {
                to: email,
                from: 'hunteronline4477@gmail.com',
                subject: ' Forgot Password ',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/forgot/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err);
                    // res.send(err);
                } else {
                    // res.send('message sent');
                    console.log('sent');
                }
            });

            let dbforgot = await dbForgot.findOne({ email: email });
            if (dbforgot) {
                dbforgot.date = Date.now() + 30 * 60 * 1000;
                dbforgot.token = token;

                let result = await dbuser.save();
                res.send({ code: 1, message: 'Check Ur mail' })
            } else {
                dbforgot = new dbForgot();
                dbforgot.email = email;
                dbforgot.date = Date.now() + 30 * 60 * 1000;
                dbforgot.token = token;

                let result = await dbforgot.save();
                res.send({ code: 1, message: 'Check Ur mail' })
            }
        } catch (ex) {
            res.status(500).send({ code: -1, message: 'Internal Server error ' + ex });
        }
    }
    next();
});

module.exports = router;
