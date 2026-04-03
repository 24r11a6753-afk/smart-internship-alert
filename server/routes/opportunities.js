const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');
const auth = require('../middlewares/auth');

// Get all opportunities with filters
router.get('/', async (req, res) => {
  try {
    const { category, type, search, mode } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (type) query.type = type;
    if (mode) query.mode = mode;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const opportunities = await Opportunity.find(query).sort({ createdAt: -1 });
    res.json(opportunities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single opportunity
router.get('/:id', async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    res.json(opportunity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bookmark/Save an opportunity
router.post('/:id/bookmark', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const opportunityId = req.params.id;

    if (user.bookmarkedOpportunities.includes(opportunityId)) {
      // Remove bookmark
      user.bookmarkedOpportunities = user.bookmarkedOpportunities.filter(
        id => id.toString() !== opportunityId
      );
      await user.save();
      return res.json({ message: 'Bookmark removed', bookmarkedOpportunities: user.bookmarkedOpportunities });
    } else {
      // Add bookmark
      user.bookmarkedOpportunities.push(opportunityId);
      await user.save();
      return res.json({ message: 'Opportunity bookmarked', bookmarkedOpportunities: user.bookmarkedOpportunities });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create an opportunity (Admin typically, but left accessible or auth-protected for now)
router.post('/', auth, async (req, res) => {
  try {
    // Basic role check
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const newOpportunity = new Opportunity(req.body);
    await newOpportunity.save();

    // Trigger real-time notification
    if (req.io) {
      req.io.emit('new_opportunity', {
        message: `New ${newOpportunity.type}: ${newOpportunity.title} at ${newOpportunity.company}`,
        opportunity: newOpportunity
      });
    }

    res.status(201).json(newOpportunity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
