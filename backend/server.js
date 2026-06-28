import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'

dotenv.config()

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'FounderFlow backend running' })
})

app.use('/auth', authRoutes)

app.listen(process.env.PORT || 3001, () => {
  console.log(`FounderFlow backend running on port ${process.env.PORT || 3001}`)
})
