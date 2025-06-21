import mongoose from 'mongoose';

const mathTopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  equations: { type: [String], default: [] },
  applications: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.model('MathTopic', mathTopicSchema);
