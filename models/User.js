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
    // Find all the thoughts associated with the user and delete them
    await Thought.deleteMany({ username: this.username });

    // Continue to the next middleware (which will handle the user deletion)
    next();
  } catch (err) {
    // If there's an error, pass it to the error handling middleware
    next(err);
  }
});

// Ensure the 'friends' field is set to an empty array if it doesn't exist
userSchema.pre('save', function (next) {
  this.friends = this.friends || [];
  next();
});

userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
