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
      get: (createdAt) => new Date(createdAt).toISOString(), 
    },
    reactions: [
      {
        reactionId: {
          type: mongoose.Schema.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(), 
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
          get: (createdAt) => new Date(createdAt).toISOString(), 
        },
      },
    ],
  },
  {
    toJSON: { getters: true }, 
  }
);

thoughtSchema.pre('save', function (next) {
  this.reactions = this.reactions || [];
  next();
});

thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;
