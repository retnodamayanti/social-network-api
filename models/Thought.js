const mongoose = require('mongoose');

const thoughtSchema = new mongoose.Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAt) => new Date(createdAt).toISOString(), // Format the timestamp on query
    },
    reactions: [
      {
        reactionId: {
          type: mongoose.Schema.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(), // Generate a new ObjectId for each reaction
        },
        reactionBody: {
          type: String,
          required: true,
          maxlength: 280,
        },
        username: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
          get: (createdAt) => new Date(createdAt).toISOString(), // Format the timestamp on query
        },
      },
    ],
  },
  {
    toJSON: { getters: true }, // Include getter methods when converting to JSON
  }
);

// Ensure the 'reactions' field is set to an empty array if it doesn't exist
thoughtSchema.pre('save', function (next) {
  this.reactions = this.reactions || [];
  next();
});

thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;
