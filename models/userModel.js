const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'GIVE US YOUR E-MAIL!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'We need a VALID e-mail!']
  },
  accountIdNum: {
    type: 'string'
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Enter a password!'],
    minlength: 8,
    select: false
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordConfirm: {
    type: String,
    required: [true, 'You need to confirm your PW!'],
    validate: {
      //THIS ONLY WORKS ON CREATE AND SAVE!!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.pre('save', async function(next) {
  //Only run this function is PW was actually changed.
  if (!this.isModified('password')) return next();

  //Hash the PW with cost of 12.
  this.password = await bcrypt.hash(this.password, 12);

  //Delete PW confirm field for security.
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now();
  next();
});

userSchema.pre(/^find/, function(next) {
  // this point to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    console.log(changedTimestamp);
    console.log(JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;

  //Reminder: Ask why we're using Crypto vs. BCrypt?
};

//Models usually have a capital letter!!!
const User = mongoose.model('User', userSchema);

module.exports = User;
