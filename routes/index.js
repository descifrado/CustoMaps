const express = require('express'),
    passport = require('passport'),
    router = express.Router()

router.get('/',async (req,res,next) =>{
    if(!req.user) res.end("Not signed in");
    try{
        // let trendingVideos = await trending.find({});
        // trendingVideos = await videoModel.dbVideo.populate(trendingVideos , { path: 'videoId' , model : 'Video'});
        // trendingVideos.sort((a,b)=>{
        //     if(a.rank > b.rank ) return 1;
        //     return -1;
        // });
        res.render('index.ejs',{ user: req.user, coord : true ,result1 : [],src : '25.491899,81.865059', dest : '25.491899,81.865059',safety : 'true'});
    }
    catch(err){
        console.log("Some error occured in index handler."+err);
    }
});

module.exports = router;
