const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Add missing semicolon

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: function(){
      return !this.googleId && !this.linkedinId;
    }
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function(){
      return !this.googleId && !this.linkedinId;
    }
  },
  phone:{
    type: Number,
      required: function() {
      return !this.googleId && !this.linkedinId; // Only required if not OAuth user
    }
  },
  role: {
    type: String,
    enum: ['productowner', 'admin', 'teamleader', 'salesrep'],
    default: 'admin'
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  linkedinId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  profilePicture: {
    type: String
  },
  isGoogleUser: {
    type: Boolean,
    default: false
  },
  isLinkedInUser: {
    type: Boolean,
    default: false
  },
  firstName: String,
  lastName: String
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.isGoogleUser || this.isLinkedInUser) {
    return next(); // Add return here
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next(); // Add next() here
});

module.exports = mongoose.model('User', userSchema);
