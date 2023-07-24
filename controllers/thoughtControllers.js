const User = require('../models/User');
const Thought = require('../models/Thought');

// Controller functions for thought routes
exports.getAllThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find().populate('reactions');
    res.json(thoughts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get thoughts.' });
  }
};

exports.getThoughtById = async (req, res) => {
    try {
      const thought = await Thought.findById(req.params.id).populate({
        path: 'reactions',
        populate: {
          path: 'username',
          select: 'username',
        },
      });
  
      if (!thought) {
        return res.status(404).json({ message: 'Thought not found.' });
      }
  
      res.json(thought);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get the thought.' });
    }
  };
  

exports.createThought = async (req, res) => {
    try {
      const { thoughtText, username, userId } = req.body;
  
      // Check if the user with the given userId exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Create the new thought
      const newThought = await Thought.create({
        thoughtText,
        username,
      });
  
      // Add the new thought's ID to the 'thoughts' array of the user
      user.thoughts.push(newThought._id);
      await user.save();
  
      res.status(201).json(newThought);
    } catch (err) {
      res.status(400).json({ error: 'Failed to create a new thought.' });
    }
  };

exports.updateThought = async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found.' });
    }
    res.json(updatedThought);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update the thought.' });
  }
};

exports.deleteThought = async (req, res) => {
  try {
    const deletedThought = await Thought.findByIdAndRemove(req.params.id);
    if (!deletedThought) {
      return res.status(404).json({ message: 'Thought not found.' });
    }
    res.json({ message: 'Thought has been deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete the thought.' });
  }
};

exports.addReaction = async (req, res) => {
  try {
    const { reactionBody, username } = req.body;
    const thoughtId = req.params.thoughtId;

    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $push: { reactions: { reactionBody, username } } },
      { new: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found.' });
    }

    res.status(201).json(updatedThought);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add reaction to the thought.' });
  }
};

exports.removeReaction = async (req, res) => {
  try {
    const thoughtId = req.params.thoughtId;
    const reactionId = req.params.reactionId;

    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $pull: { reactions: { reactionId } } },
      { new: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found.' });
    }

    res.json(updatedThought);
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove reaction from the thought.' });
  }
};
