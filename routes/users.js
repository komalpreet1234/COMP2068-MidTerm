const { new: _new, create } = require('../controllers/UsersController');

module.exports = router => {
  router.get('/register', _new);
  router.post('/users', create);
};