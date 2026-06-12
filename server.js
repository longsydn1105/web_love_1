import 'dotenv/config'
import express from 'express'
import handler from './api/submit-feedback.js'

const app = express()
app.use(express.json())

app.all('/api/submit-feedback', (req, res) => handler(req, res))

const PORT = process.env.API_PORT || 3001
app.listen(PORT, () => {
  console.log(`API server: http://localhost:${PORT}`)
})
