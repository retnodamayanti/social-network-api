const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');

// GET all users
router.get('/', userController.getAllUsers);

// GET a user by its id 
router.get('/:id', userController.getUserById);

// POST a new user
router.post('/', userController.createUser);

// PUT to update a user 
router.put('/:id', userController.updateUser);

// DELETE to remove user 
router.delete('/:id', userController.deleteUser);

// POST to add a friend to a user
router.post('/:userId/friends/:friendId', userController.addFriend);

// DELETE to remove a friend from a user
router.delete('/:userId/friends/:friendId', userController.removeFriend);

module.exports = router;
