const express = require('express'),
    passport = require('passport'),
    router = express.Router();
var request = require('request');
var https = require('https')


function getPoints(src, des) {
    return new Promise((resolve, reject) => {
        request({
            'url': 'https://maps.googleapis.com/maps/api/directions/json?origin=' + src + '&destination=' + des + '&key=AIzaSyAGJuiMIFfz2EqhwuWBXtBSdFbILXAl-M0&alternatives=true&travelMode=DRIVING',
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
// ,
function getPlacesFromServer(lat, lng, rad) {
    return new Promise((resolve, reject) => {
        request({
            'url': 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + lng + '&radius=' + rad + '&key=AIzaSyAGJuiMIFfz2EqhwuWBXtBSdFbILXAl-M0',
            'method': "GET",
            'proxy': 'http://edcguest:edcguest@172.31.100.14:3128'
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(response);
            } else {
                reject(error);
            }
        });
    })


};

function getPlaces(src, des, rad) {
    return new Promise((resolve, reject) => {
        getPlacesFromServer(src, des, rad).then((res) => {
            body = res.body;
            body = JSON.parse(body);
            places_types = [];
            for (var r in body.results) {
                places_types.push(body.results[r].types);
            }
            resolve(places_types);
        })

    })
}



function decode_polyline(str, precision) {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, Number.isInteger(precision) ? precision : 5);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates[0];
};


async function tmp(src, dest) {
    return new Promise((resolve, reject) => {
        let coordinates = getPoints(src, dest);

        coordinates.then(res => {
            body = res.body;
            body = JSON.parse(body)
            var coords_routes = []
            routes = body.routes;
            for (var r in routes) {
                var coords_legs = [];
                route = routes[r]
                // console.log(route);
                // console.log('88888888888');
                legs = route.legs;
                for (var l in legs) {
                    steps = legs[l].steps;
                    for (var s in steps) {
                        polyline = steps[s].polyline;
                        pointstr = polyline.points;
                        coords_legs.push(decode_polyline(pointstr, NaN));
                        //  console.log(coords_legs)
                    }
                }
                coords_routes.push(coords_legs)
                // coords_legs contains array of coordinates of each leg
            }
            // console.log("csn");
            // console.log(coords_routes)
            resolve(coords_routes);
        })
    })



}

async function getAllPlaces(src, dest) {
    return new Promise(async (resolve, reject) => {
        let arr = [];
        try {
            let res = await tmp(src, dest);
            //console.log(res)
            for (r in res) {
                let tarr = new Set()
                //console.log(r);
                route = res[r];
                for (l in route) {
                    leg = route[l];
                    //   console.log(leg);
                    // console.log(leg[0]);
                    let y = await getPlaces(leg[0], leg[1], 30);
                    for (x in y) {
                        for (z in y[x]) {
                            tarr.add(y[x][z]);
                        }
                    }
                }

                arr.push(Array.from(tarr));
            }
            resolve(arr);
        }
        catch (err) {
            reject(err);
            // console.log(err);
        }
    })
}


let myMap = new Map();
myMap.set("bank", 50);
myMap.set("atm", 40);
myMap.set("bar", -100);
myMap.set("casino", -60);
myMap.set("cemetery", -40);
myMap.set("embassy", 60);
myMap.set("church", 40);
myMap.set("fire_station", 50);
myMap.set("hindu_temple", 50);
myMap.set("hospital", 50);
myMap.set("liquor_store", -80);
myMap.set("local_government_office", 40);
myMap.set("mosque", 40);
myMap.set("night_club", -40);
myMap.set("police", 150);
myMap.set("post_office", 70);

let myMap1=new Map();
myMap1.set("amusement_park", 100);
myMap1.set("art_gallery", 50);
myMap1.set("bakery", 60);
myMap1.set("cafe", 40);
myMap1.set("casino", 50);
myMap1.set("meal_delivery", 30);
myMap1.set("meal_takeaway", 30);
myMap1.set("movie_theater", 80);
myMap1.set("museum", 70);
myMap1.set("restaurant", 90);
myMap1.set("zoo", 80);
myMap1.set("park", 40);
myMap1.set("tourist_attraction", 60);
myMap1.set("night_club", 40);
myMap1.set("movie_rental", 40);
myMap1.set("lodging", 80);

// Assuming a 2D Array routePointsType to be given by Backend API team
routePointsType = new Array(3);
routePointsType[0] = new Array("bank", "gym", "food");
routePointsType[1] = new Array("bar");
routePointsType[2] = new Array("police", "restaurant");

// var score = 0;
// console.log(score);
// console.log(routePointsType.length);
// for (var i = 0; i < routePointsType.length; i++) {
//     if (myMap.has(routePointsType[i])) {
//         console.log(routePointsType[i] + " " + myMap.get(routePointsType[i]));
//         score += myMap.get(routePointsType[i])
//     }
// }


// arr.then((res) => {
//     // console.log(res);
//     for (var j = 0; j < res.length; j++) {
//         let routePointsType = res[j];
//         let score = 0;
//         for (var i = 0; i < routePointsType.length; i++) {
//             if (myMap.has(routePointsType[i])) {
//                 console.log(routePointsType[i] + " " + myMap.get(routePointsType[i]));
//                 score += myMap.get(routePointsType[i])
//             }
//         }
//         console.log(score);
//     }
// }).catch((err) => {
//     console.log(err);
// })


function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}
async function getmanualScore(src, dest, crimespots) {
    // crimespots will be a 2d array
    return new Promise(async (resolve, reject) => {
        let arr = [];
        try {
            let res = await tmp(src, dest);
            //console.log(res)

            for (r in res) {
                let sc = 0;

                //console.log(r);
                route = res[r];
                for (var i = 0; i < crimespots.length; i++) {
                    let mindis = 100000000;
                    let clat = crimespots[i][0];
                    let clong = crimespots[i][1];
                    for (l in route) {
                        leg = route[l];
                        let lat = leg[0];
                        let long = leg[1];
                        let dis = getDistanceFromLatLonInKm(clat, clong, lat, long);
                        dis = dis * 1000;
                        // console.log(dis);
                        // console.log('9999999999');
                        mindis = Math.min(dis, mindis);

                    }
                    // console.log(mindis);
                    sc = sc + 1 / mindis;

                }

                arr.push(-sc * 1000);
                console.log(-sc * 1000);
                

            }
            resolve(arr);
        }
        catch (err) {
            reject(err);
            // console.log(err);
        }
    })
}

router.get('/', async (req, res, next) => {

    try {
        let allReport = await dbReport.find();
        let coord = [];
        for (i in allReport) {
            let tmp = [];
            tmp.push(allReport[i].lat);
            tmp.push(allReport[i].lgt);
            coord.push(tmp);
        }

        let src = req.query.src;
        let dest = req.query.dest;
        let safety = req.query.safety;
        let entertainment = req.query.entertainment;
        if(!src || !dest || src.length <3 || dest.length < 3){
             res.redirect('/index');
        }
        let score1 = await getmanualScore(src,dest,coord);
        let finMap;
        if(entertainment != 'true'){
            finMap = myMap;
            safety = 'true';
        }else{
            finMap = myMap1;
            safety = 'false';
        }
        // res.send(req.query);
        let arr = getAllPlaces(src, dest);
        arr
            .then((allPlaces) => {
                console.log(allPlaces);
                let result = new Array();
                for (var j = 0; j < allPlaces.length; j++) {
                    let routePointsType = allPlaces[j];
                    let score = 0;
                    for (var i = 0; i < routePointsType.length; i++) {
                        if (finMap.has(routePointsType[i])) {
                            console.log(routePointsType[i] + " " + finMap.get(routePointsType[i]));
                            score += finMap.get(routePointsType[i])
                        }
                    }
                    result.push(score);
                }
                for(i in result){
                    result[i] += score1[i];
                }
                // res.render('home3.ejs',{ user: req.user, coord : true ,result1 : [],src : '25.491899,81.865059', dest : '25.491899,81.865059'});
                res.render('home3.ejs',{ user: null, coord : false ,result1 : result,src : src, dest : dest,safety : safety});
            })
            .catch((err) =>{
                console.log(err);
                res.status(500).send('Internal server error');
            })
    }
    catch (ex) {
        console.log(ex.message);
    }
});

module.exports = router;