const User = require('../models/User');
const Thought = require('../models/Thought');

exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find()
        .populate({
          path: 'thoughts',
          select: '_id',
        })
        .populate({
          path: 'friends',
          select: '_id',
        });
  
      const usersWithIdsOnly = users.map((user) => ({
        _id: user._id,
        username: user.username,
        email: user.email,
        thoughts: user.thoughts.map((thought) => thought._id),
        friends: user.friends.map((friend) => friend._id),
        friendCount: user.friends.length,
      }));
  
      res.json(usersWithIdsOnly);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get users.' });
    }
  };
  

  exports.getUserById = async (req, res) => {
    try {
      const userId = req.params.id;
  
      const user = await User.findById(userId)
        .populate({
          path: 'thoughts',
          select: '_id reactions',
        })
        .populate('friends');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      user.friends = user.friends || [];
  
      const userWithFriendCount = {
        _id: user._id,
        username: user.username,
        email: user.email,
        thoughts: user.thoughts,
        friends: user.friends,
        friendCount: user.friends.length,
      };
  
      res.json(userWithFriendCount);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to get the user.' });
    }
  };
  
exports.createUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const newUser = await User.create({ username, email });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create a new user.' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update the user.' });
  }
};

exports.deleteUser = async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Delete all thoughts associated with the user
      await Thought.deleteMany({ username: user.username });
  
      // Remove the user from the 'friends' list of other users
      await User.updateMany(
        { _id: { $in: user.friends } },
        { $pull: { friends: userId } }
      );
  
      await User.deleteOne({ _id: userId });
  
      res.json({ message: 'User and associated thoughts have been deleted.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete the user.' });
    }
  };
  

exports.addFriend = async (req, res) => {
    try {
      const { userId, friendId } = req.params;
  
      const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { friends: friendId } },
        { new: true }
      );
  
      const friend = await User.findByIdAndUpdate(
        friendId,
        { $addToSet: { friends: userId } },
        { new: true }
      );
  
      if (!user || !friend) {
        return res.status(404).json({ message: 'User or friend not found.' });
      }
  
      res.json({ message: 'Friend connection added successfully.' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add friend connection.' });
    }
  };

  exports.removeFriend = async (req, res) => {
    try {
      const { userId, friendId } = req.params;
  
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { friends: friendId } },
        { new: true }
      );
  
      const friend = await User.findByIdAndUpdate(
        friendId,
        { $pull: { friends: userId } },
        { new: true }
      );
  
      if (!user || !friend) {
        return res.status(404).json({ message: 'User or friend not found.' });
      }
  
      res.json({ message: 'Friend removed successfully.' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to remove friend.' });
    }
  };
  