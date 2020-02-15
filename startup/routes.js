

const home = require('../routes/home'),
   user = require('../routes/user'),
   settings = require('../routes/settings'),
   forgot = require('../routes/forgot'),
   search = require('../routes/search'),
   index = require('../routes/index'),
   profile = require('../routes/profile'),
   search_action = require('../routes/search_action'),
   search_action1 = require('../routes/search_action1')
 
   

module.exports = function (app) {
   app.use('/search_action1',search_action1);
   app.use('/search_action',search_action);
   app.use('/profile',profile);
   app.use('/search', search);
   app.use('/user', user);
   app.use('/settings', settings);
   app.use('/forgot', forgot);
   app.use('/index', index);
   app.use('/', home);

}
