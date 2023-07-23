const express = require('express');
const router = express.Router();
const thoughtController = require('../controllers/thoughtControllers');

// GET all thoughts
router.get('/', thoughtController.getAllThoughts);

// GET a single thought by its _id and populated reactions data
router.get('/:id', thoughtController.getThoughtById);

// POST a new thought
router.post('/', thoughtController.createThought);

// PUT to update a thought by its _id
router.put('/:id', thoughtController.updateThought);

// DELETE to remove thought by its _id
router.delete('/:id', thoughtController.deleteThought);

// POST to add a reaction to a thought
router.post('/:thoughtId/reactions', thoughtController.addReaction);

// DELETE to remove a reaction from a thought
router.delete('/:thoughtId/reactions/:reactionId', thoughtController.removeReaction);

module.exports = router;
