//Reminder: Ctrl + D to select next instance of a match in VS Code.

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const cookieParser = require('cookie-parser');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Serving static files. Express takes the "public" directory html file and makes it part of the root folder.
app.use(express.static(path.join(__dirname, 'public')));

// 1) GLOBAL MIDDLEWARES
//SET SECURITY HTTP HEADERS
app.use(helmet());

//DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //Added as example of 3rd party middleware. Used to show time request was made to the app.
}
//LIMIT THE NUMBER OF REQUESTS FROM THE SAME IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api', limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//Middleware built into Express for handling forms
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

//Reads the data from Cookies
app.use(cookieParser());

//Data sanitization against NOSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS attacks
app.use(xss());

//Cleans up query string to prevent errors
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

//Adding our own Middleware. Global middleware is typically declared
// up top. You can have as much middleware as you'd like!

/* 4 TEST MIDDLEWARE */ app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  console.log(req.cookies);
  next();
});

// 3) ROUTES - Mounting the routers.

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
