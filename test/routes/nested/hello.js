var Router = require('../../../lib/router');
var router = new Router();

router.get('/hello', function(req, res, next){
  res.send('hello');
  next();
});

module.exports = router;
