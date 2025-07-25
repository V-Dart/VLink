const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const clientSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  clientType: {
    type: String,
    enum: ['Product-based', 'Service-based'],
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  features: {
    feedback: { type: Boolean, default: false },
    dashboard: { type: Boolean, default: true },
    ticketing: { type: Boolean, default: false },
    customerChat: { type: Boolean, default: false },
    orders: { type: Boolean, default: false },
    analytics: { type: Boolean, default: false },
    reports: { type: Boolean, default: false },
    support: { type: Boolean, default: false }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
clientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
clientSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('Client', clientSchema);