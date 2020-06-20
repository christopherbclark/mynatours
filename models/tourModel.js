const mongoose = require('mongoose');
const slugify = require('slugify');
const prettyMilliseconds = require('pretty-ms');
const validator = require('validator');
//const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name!'],
      unique: true,
      trim: true,
      maxlength: [40, 'That name is too f-ing LONG! JESUS!'],
      minlength: [10, 'THAT NAME IS TOO SHORT!!!!!']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration!']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: "It's either EASY, MEDIUM or DIFFICULT, fool."
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "RATINGS CAN'T BE BELOW 1, YOU IDIOT!"],
      max: [5, 'Calm the hell down. No ratings above a 5!']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      currency: 'USD',
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      currency: 'USD',
      validate: {
        //This only works on current doc for NEW documents.
        validator: function(val) {
          return val < this.price; //if this evaluation comes out as false, it will return an error. Note: this is an example of CUSTOM data validaiton.
        },
        message:
          // eslint-disable-next-line no-template-curly-in-string
          'Your discount of ${VALUE} is too INSANE. You are giving away MONEY!'
      }
    },
    summary: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      //GeoJSON Data
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    //Creating an embedded document
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//tourSchema.index({ price: 1 });

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('duraitonWeeks').get(function() {
  return this.duration / 7;
});

//Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

//DOCUMENT MIDDLEWARE: RUNS BEFORE THE .SAVE AND .CREATE COMMANDS // Here, "this" points to the current document
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//CODE FOR EMBEDDING
// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre('save', function(next) {
//   console.log('Will save document....');
//   next();
// });
//THIS IS **POST** MIDDLEWARE

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE //Here, "this" points to the current query
tourSchema.pre(/^find/, function(next) {
  // tourSchema.pre('find', function(next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${prettyMilliseconds(Date.now() - this.start)}!`);
  //console.log(docs);
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
});

//AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline()); //Here, "this" points to the aggreagation object

//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
