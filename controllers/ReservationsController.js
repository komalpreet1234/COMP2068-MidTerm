// You need to complete this controller with the required 7 actions
const viewPath = 'reservations';
const Reservation = require('../models/reservation');
const User = require('../models/user');

exports.index = async (req, res) => {
  try {
    const reservations = await Reservation
      .find()
      .populate('user')
      .sort({updatedAt: 'desc'});

    res.render(`${viewPath}/index`, {
      reservations: reservations
    });
  } catch (error) {
    req.flash('danger', `There was an error displaying the Reservations: ${error}`);
    res.redirect('/');
  }
};


exports.new = (req, res) => {
  res.render(`${viewPath}/new`, {
    pageTitle: 'New Reservation',
	roomTypes: ['single bed', 'double bed', 'queen', 'King']
  });
};


exports.create = async (req, res) => {
  try {
    console.log(req.session.passport);
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});
    const reservation = await Reservation.create({user: user._id, ...req.body});

    req.flash('success', 'Reservation created successfully');
    res.redirect(`/reservation/${reservation.id}`);
  } catch (error) {
    req.flash('danger', `There was an error creating this Reservation: ${error}`);
    req.session.formData = req.body;
    res.redirect('/reservation/new');
  }
};


exports.show = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('user');
    res.render(`${viewPath}/show`, {
      reservation: reservation
    });
  } catch (error) {
    req.flash('danger', `There was an error displaying this Reservation: ${error}`);
    res.redirect('/');
  }
};


exports.edit = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    res.render(`${viewPath}/edit`, {
      formData: reservation,
	roomTypes: ['single bed', 'double bed', 'queen', 'King']
    });
  } catch (error) {
    req.flash('danger', `There was an error accessing this Reservation: ${error}`);
    res.redirect('/');
  }
};

exports.update = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});

    let reservation = await Reservation.findById(req.body.id);
    if (!reservation) throw new Error('Reservation could not be found');

    const attributes = {user: user._id, ...req.body};
    await Reservation.validate(attributes);
    await Reservation.findByIdAndUpdate(attributes.id, attributes);

    req.flash('success', 'The Reservation was updated successfully');
    res.redirect(`/reservation/${req.body.id}`);
  } catch (error) {
    req.flash('danger', `There was an error updating this Reservation: ${error}`);
    res.redirect(`/reservation/${req.body.id}/edit`);
  }
};

exports.delete = async (req, res) => {
  try {
    console.log(req.body);
    await Reservation.deleteOne({_id: req.body.id});
    req.flash('success', 'The Reservation was deleted successfully');
    res.redirect(`/reservation`);
  } catch (error) {
    req.flash('danger', `There was an error deleting this Reservation: ${error}`);
    res.redirect(`/reservation`);
  }
};
