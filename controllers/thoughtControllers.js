const User = require('../models/User');
const Thought = require('../models/Thought');
const mongoose = require('mongoose');

exports.getAllThoughts = async (req, res) => {
    try {
      const thoughts = await Thought.find().populate('reactions').lean();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get thoughts.' });
    }
  };
  

exports.getThoughtById = async (req, res) => {
    try {
      const thoughtId = req.params.id;
  
      // Check if thoughtId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(thoughtId)) {
        return res.status(404).json({ message: 'Invalid thought ID.' });
      }
  
      const thought = await Thought.findById(thoughtId).populate({
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
      console.log(err);
      res.status(500).json({ error: 'Failed to get the thought.' });
    }
  };
  

  

exports.createThought = async (req, res) => {
    try {
      const { thoughtText, username, userId } = req.body;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      const newThought = await Thought.create({
        thoughtText,
        username,
      });
  
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
  
      if (!mongoose.Types.ObjectId.isValid(thoughtId)) {
        return res.status(400).json({ error: 'Invalid thoughtId.' });
      }
  
      const reactionId = new mongoose.Types.ObjectId(); // Generate a new ObjectId for the reaction
  
      const updatedThought = await Thought.findByIdAndUpdate(
        thoughtId,
        { $push: { reactions: { reactionBody, username, _id: reactionId } } }, // Set the _id field to reactionId
        { new: true }
      ).lean();
  
      if (!updatedThought) {
        return res.status(404).json({ message: 'Thought not found.' });
      }
  
      res.status(201).json(updatedThought);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add reaction to the thought.' });
    }
  };
  
  exports.removeReaction = async (req, res) => {
    try {
      const thoughtId = req.params.thoughtId;
      const reactionId = req.params.reactionId;
  
      if (!mongoose.Types.ObjectId.isValid(thoughtId) || typeof reactionId !== 'string') {
        return res.status(400).json({ message: 'Invalid thoughtId or reactionId.' });
      }
  
      const updatedThought = await Thought.findByIdAndUpdate(
        thoughtId,
        { $pull: { reactions: { reactionId: reactionId } } }, 
        { new: true }
      );
  
      if (!updatedThought) {
        return res.status(404).json({ message: 'Thought not found.' });
      }
  
      console.log('Updated Thought:', updatedThought);
      res.json({ message: 'Reaction has been deleted.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to remove reaction from the thought.' });
    }
  };
  
  
  
  
  
  
  
  
  
  
  
  
  
