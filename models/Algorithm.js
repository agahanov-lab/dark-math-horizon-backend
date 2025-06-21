import mongoose from 'mongoose';

const algorithmSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  githubLink: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Algorithm', algorithmSchema);
