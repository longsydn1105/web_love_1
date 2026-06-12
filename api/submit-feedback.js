import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

const feedbackSchema = new mongoose.Schema({
  score: { type: Number, required: true, min: 1, max: 10 },
  feedbackText: { type: String, default: '', trim: true },
  createdAt: { type: Date, default: Date.now },
})

const FeedbackSession =
  mongoose.models.FeedbackSession ||
  mongoose.model('FeedbackSession', feedbackSchema)

let cachedConnection = null

async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection
  }
  cachedConnection = await mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  })
  return cachedConnection
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { score, feedbackText } = req.body ?? {}

  if (!score || typeof score !== 'number' || score < 1 || score > 10) {
    return res.status(400).json({ error: 'Điểm phải từ 1 đến 10' })
  }

  if (!MONGODB_URI) {
    return res.status(500).json({ error: 'Chưa cấu hình MONGODB_URI' })
  }

  try {
    await connectDB()

    const session = new FeedbackSession({
      score,
      feedbackText: feedbackText || '',
    })

    await session.save()

    return res.status(200).json({ success: true, id: session._id })
  } catch (err) {
    console.error('DB Error:', err)
    return res.status(500).json({ error: 'Lỗi server, thử lại nhé' })
  }
}
