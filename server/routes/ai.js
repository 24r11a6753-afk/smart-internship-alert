const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const Opportunity = require('../models/Opportunity');
const auth = require('../middlewares/auth');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;
    
    // Fetch some recent opportunities to provide context to the AI
    const recentOpportunities = await Opportunity.find().limit(10).lean();
    const contextStr = JSON.stringify(recentOpportunities);

    // Prompt engineering to guide the AI
    const systemPrompt = `You are a helpful assistant for the "Smart Internship & Hackathon Alert System". 
Your goal is to help users find suitable internships and hackathons based on their queries. 
Here are some recent opportunities available in our database: ${contextStr}.
If a user asks about available roles or hackathons, use this data to suggest matches. Include deadlines and links. 
If they ask something unrelated, politely steer them back to internships and hackathons.`;

    // Only make real request if API key is not exactly "your_openai_api_key_here"
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        model: 'gpt-3.5-turbo',
      });

      return res.json({ response: completion.choices[0].message.content });
    } else {
      // Mock response for testing if no key is provided
      return res.json({ 
        response: "Mock AI Response: I see you are asking about opportunities! Please add a valid OpenAI API key to `.env` for real responses. Try checking our dashboard for the latest roles!" 
      });
    }
  } catch (err) {
    console.error('OpenAI Error:', err);
    res.status(500).json({ message: 'AI service unavailable currently.' });
  }
});

module.exports = router;
