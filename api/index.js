const express = require('express')
const multer = require('multer')
const cors = require('cors')

const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const path = require('path')
dotenv.config()

try {
  mongoose.connect(process.env.MONGO_URL)
  console.log('Connected to MongoDB')
} catch (error) {
  console.log(`Error: ${error.message}`)
}

app.use('/images', express.static(path.join(__dirname, 'public/images')))

// Middleware
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('common'))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name)
  },
})

const upload = multer({ storage })
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    return res.status(200).json('File uploaded successfully')
  } catch (err) {
    console.log(err)
    return res.status(500).json('Error uploading file')
  }
})

app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)

app.listen(8800, () => {
  console.log('Backend server is running!')
})
