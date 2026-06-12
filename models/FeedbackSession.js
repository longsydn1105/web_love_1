import mongoose from 'mongoose'

const feedbackSchema = new mongoose.Schema({
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  feedbackText: {
    type: String,
    required: false,
    default: '',
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default
  mongoose.models.FeedbackSession ||
  mongoose.model('FeedbackSession', feedbackSchema)
