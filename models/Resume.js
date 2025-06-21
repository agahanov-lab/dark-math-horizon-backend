import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

// Only allow one resume at a time
resumeSchema.pre('save', async function(next) {
  if (this.isNew) {
    await this.constructor.deleteMany({});
  }
  next();
});

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
