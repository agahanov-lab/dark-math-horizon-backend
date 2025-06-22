const express = require('express');
const router = express.Router();
const MathTopic = require('../models/MathTopic');

// Get all math topics
router.get('/', async (req, res) => {
  try {
    const topics = await MathTopic.find();
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new math topic
router.post('/', async (req, res) => {
  const topic = new MathTopic({
    title: req.body.title,
    description: req.body.description,
    equations: req.body.equations,
    applications: req.body.applications
  });

  try {
    const newTopic = await topic.save();
    res.status(201).json(newTopic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a math topic
router.delete('/:id', async (req, res) => {
  try {
    const topic = await MathTopic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Math topic not found' });
    }
    await MathTopic.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
