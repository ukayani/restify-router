var Router = require('../../lib/router');
var router = new Router();

router.get('/test', function(req, res, next){
  res.send('test');
  next();
});

module.exports = router;
