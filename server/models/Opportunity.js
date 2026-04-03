const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['internship', 'hackathon'], required: true },
  category: { type: String, required: true },
  mode: { type: String, enum: ['Online', 'Offline', 'Hybrid'], default: 'Offline' },
  deadline: { type: Date, required: true },
  link: { type: String, required: true },
  location: { type: String, default: 'Remote' },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Opportunity = mongoose.model('Opportunity', opportunitySchema);
module.exports = Opportunity;
