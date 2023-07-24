const User = require('../models/User');

// Controller functions for user routes
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
  
      // Iterate through the users and remove unnecessary data from the thoughts and friends arrays
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
  
      // Find the user by its ID and populate both the '_id' and 'reactions' fields of 'thoughts'
      const user = await User.findById(userId)
        .populate({
          path: 'thoughts',
          select: '_id reactions', // Populate both '_id' and 'reactions' fields
        })
        .populate('friends');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Ensure the 'friends' field is set to an empty array if it doesn't exist
      user.friends = user.friends || [];
  
      // Create a new object with the necessary properties
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
      // Log the error for debugging purposes
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
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      res.json({ message: 'User has been deleted.' });
    } catch (err) {
        console.error(err);
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

  exports.removeFriend = async (req, res) => {
    try {
      const { userId, friendId } = req.params;
  
      // Remove friendId from the friends array of the user with userId
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { friends: friendId } },
        { new: true }
      );
  
      // Remove userId from the friends array of the user with friendId
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
  