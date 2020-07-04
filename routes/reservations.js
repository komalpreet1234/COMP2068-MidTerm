const { index, show, new: _new, edit, create, update, delete: _delete } = require('../controllers/ReservationsController');

function auth (req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash('danger', 'You need to login first.');
    return res.redirect('/login');
  }
  next();
}

module.exports = router => {
  router.get('/reservation', index);
  router.get('/reservations/new', auth, _new);
  router.post('/reservations', auth, create);
  router.get('/reservation/:id', show); 
  router.post('/reservations/update', auth, update); 
  router.post('/reservations/delete', auth, _delete);
  router.get('/reservations/:id/edit', auth, edit);
};