const express = require('express'),
    router = express.Router(),
    moment = require('moment')                                      // added to convert standard uploadDate output to required one 

router.get('/query',async function(req, res) {
    query = req.query.query;
   console.log(query);
    var list = await getSearchResult(query);
    console.log(list);
    res.render('searchResults.ejs',{list : list,moment : moment,user : req.user, searchText:query});
})

module.exports = router;