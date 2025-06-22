const express = require('express');
const router = express.Router();
const Algorithm = require('../models/Algorithm');

// Get all algorithms
router.get('/', async (req, res) => {
  try {
    const algorithms = await Algorithm.find();
    res.json(algorithms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new algorithm
router.post('/', async (req, res) => {
  const algorithm = new Algorithm({
    title: req.body.title,
    description: req.body.description,
    githubLink: req.body.githubLink
  });

  try {
    const newAlgorithm = await algorithm.save();
    res.status(201).json(newAlgorithm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an algorithm
router.delete('/:id', async (req, res) => {
  try {
    const algorithm = await Algorithm.findById(req.params.id);
    if (!algorithm) {
      return res.status(404).json({ message: 'Algorithm not found' });
    }
    await Algorithm.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
