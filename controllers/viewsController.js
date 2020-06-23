const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = async (req, res, next) => {
  // 1) Get tour data from Collection
  const tours = await Tour.find();
  // 2) Build template

  // 3) Render the template from the tour data from step 1

  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
};

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that nameeeeeeeee.', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: `LOG YO ASS IN!`
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: `It's YO ACCOUNT!`
  });
};

exports.updateUserData = (req, res, next) => {
  console.log("What's up, baby!!!", req.body);
};
