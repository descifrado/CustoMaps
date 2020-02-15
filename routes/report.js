const express = require('express'),
    passport = require('passport'),
    request = require('request'),
    https = require('https'),
    { dbReport } = require('../dbModels/report'),
    router = express.Router()



function getCoordinates(addr) {
    return new Promise((resolve, reject) => {
        request({
            'url': 'https://maps.googleapis.com/maps/api/geocode/json?address=' + addr + '&key=AIzaSyAGJuiMIFfz2EqhwuWBXtBSdFbILXAl-M0',
            'method': "GET",
            'proxy': 'http://edcguest:edcguest@172.31.100.14:3128'
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(response);
            } else {
                reject(error);
            }
        })
    })
}

async function tmp(addr) {
    return new Promise((resolve, reject) => {
        let res = getCoordinates(addr);

        res.then(res => {
            let body = res.body;
            body = JSON.parse(body)
            var coordinates = [];
            let result = body.results[0];
            let geometry = result.geometry;
            // console.log(geometry);
            coordinates.push(geometry.location.lat);
            coordinates.push(geometry.location.lng);
            console.log(coordinates);
            resolve(coordinates);
        })
    })
}



router.post('/', async (req, res, next) => {
    if (!req.user) {
        res.send('Login To report').status(400);
    }
    try {
        let isCord = req.body.isCord;
        let incident = req.body.incident;
        let id = req.user._id;

        if (isCord == 'false') {

            let result = await tmp(req.body.loc);

            var report = new dbReport({
                lat: result[0],
                lgt: result[1],
                incident: incident,
                reporter: id
            })

            let err = await report.save();

            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.send('success');
            }


        } else {
            var report = new dbReport({
                lat: req.body.lat,
                lgt: req.body.lgt,
                incident: incident,
                reporter: id
            })

            let err = await report.save();

            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.send('success');
            }

            res.send(loc);
        }
    }
    catch (ex) {
        console.log(ex.message);
    }
});

module.exports = router;
