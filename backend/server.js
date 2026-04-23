import express  from 'express'
import dotenv   from 'dotenv'
import cors     from 'cors'
import connectDB from './config/db.js'
import jobRoutes  from './routes/jobRoutes.js'
import authRoutes from './routes/authRoutes.js'

dotenv.config()
connectDB()

const app = express()

// ✅ Allow React frontend to talk to backend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)

app.get('/', (req, res) => {
  res.send('Job Portal Server is running! 🚀')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})