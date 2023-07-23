const User = require('../models/User');

// Controller functions for user routes
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('thoughts friends');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get users.' });
  }
};

exports.getUserById = async (req, res) => {
    try {
      const userId = req.params.id;
      
      // Find the user by its ID and populate only the '_id' values of 'thoughts' and 'friends'
      const user = await User.findById(userId)
        .populate({
          path: 'thoughts',
          select: '_id',
        })
        .populate({
          path: 'friends',
          select: '_id',
        });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Include the 'friendCount' property in the response
      const userWithFriendCount = {
        ...user._doc,
        friendCount: user.friends.length,
      };
  
      res.json(userWithFriendCount);
    } catch (err) {
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
    const deletedUser = await User.findByIdAndRemove(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete the user.' });
  }
};

exports.addFriend = async (req, res) => {
    try {
      const { userId, friendId } = req.params;
  
      // Add friendId to the friends array of the user with userId
      const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { friends: friendId } },
        { new: true }
      );
  
      // Add userId to the friends array of the user with friendId
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
