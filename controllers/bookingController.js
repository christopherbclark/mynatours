const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tourModel

  const tour = await Tour.findById(req.params.tourId);

  // 2) Create the checkout session
  // Info about the actual session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-tours`,

    // success_url: `${req.protocol}://${req.get('host')}/?tour=${
    //   req.params.tourId
    // }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    // Info about the product to be purchased
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [
          `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`
        ],
        amount: tour.price * 100,
        currency: `usd`,
        quantity: 1
      }
    ],
    payment_intent_data: {
      application_fee_amount: tour.price * 0.01 * 100,
      transfer_data: {
        destination: tour.createdBy
      }
    }
  });

  res.status(200).json({
    status: 'success',
    session
  });
});

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   //This is only TEMPORARY because it's UNSECURE. Anyone can make bookings without paying.
//   const { tour, user, price } = req.query;

//   if (!tour && !user && !price) return next();
//   await Booking.create({ tour, user, price });

//   res.redirect(req.originalUrl.split('?')[0]);
// });

const createBookingCheckout = async session => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.display_items[0].amount / 100;
  await Booking.create({ tour, user, price });
};

// const markPaid = async session => {
//   const tour = session.client_reference_id;
//   const paymentCurrent = true;
//   await Tour.findByIdAndUpdate(tour, paymentCurrent, {
//     new: false,
//     runValidators: false
//   });
// };

const markPaid = async session => {
  const tour = session.client_reference_id;
  await Tour.findByIdAndUpdate(tour, { paymentCurrent: true });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    createBookingCheckout(event.data.object);
    res.status(200).json({ recieved: true });
    // Somehow, I want this to trigger the execution of the POST request in my front end JS file.
  }
};

exports.listingPurchase = (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET_NEWTOUR
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    markPaid(event.data.object);
    res.status(200).json({ recieved: true });
    // Somehow, I want this to trigger the execution of the POST request in my front end JS file.
  }
};

exports.webhookConnect = (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET_CONNECT
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    markPaid(event.data.object);
    res.status(200).json({ recieved: true });
    // Somehow, I want this to trigger the execution of the POST request in my front end JS file.
  } else {
    if (event.type === 'account.updated') console.log(event.data.object);
    res.status(200).json({ recievedConnect: true });
  }
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
