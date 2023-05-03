import express, { Application } from 'express'
import path from 'path'
import cors from 'cors'
// config
import { validateEnv } from './config/config'
import dbConnect from './config/dbConnect'
// routes
import { imageRouter } from './routes/image.route'

export const app: Application = express()

const port = 8080

// checking environment variables
validateEnv()

// establish db connection
dbConnect()

app.disable('x-powered-by')

app.use(express.json())

// app.use(express.static('public'))

app.use(cors())

app.use('/api/image', imageRouter)

if (process.env.NODE_ENV == 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`)
    } else {
      next()
    }
  })

  app.use(express.static(path.join(__dirname, '../../client', 'dist')))

  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client', 'dist', 'index.html'))
  })
}

// app.use(errorHandler)

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`)
})
