const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');

// GET all users
router.get('/', userController.getAllUsers);

// GET a single user by its _id and populated thought and friend data
router.get('/:id', userController.getUserById);

// POST a new user
router.post('/', userController.createUser);

// PUT to update a user by its _id
router.put('/:id', userController.updateUser);

// DELETE to remove user by its _id
router.delete('/:id', userController.deleteUser);

// POST to add a friend to a user
router.post('/:userId/friends/:friendId', userController.addFriend);

// DELETE to remove a friend from a user
router.delete('/:userId/friends/:friendId', userController.removeFriend);

module.exports = router;
