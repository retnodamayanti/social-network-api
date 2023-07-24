const mongoose = require('mongoose');
const Thought = require('./Thought');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[\w-]+@[a-zA-Z\d]+(\.[a-zA-Z\d]+)*(\.[a-zA-Z]{2,})$/,
  },
  thoughts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thought', 
    },
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
    },
  ],
});

userSchema.pre('findOneAndDelete', async function (next) {
  const userId = this._conditions._id;

  try {
    await Thought.deleteMany({ username: this.username });

    next();
  } catch (err) {
    next(err);
  }
});

userSchema.pre('save', function (next) {
  this.friends = this.friends || [];
  next();
});

userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
