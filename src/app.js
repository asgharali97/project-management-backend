import express from 'express'
import cors from 'cors'
const app = express()

app.use(express.json({ limit: "17kb" }))
app.use(express.urlencoded({ limit: "17kb" }))
app.use(express.static('public'))

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
)


app.get('/', (req, res) => {
    res.send('hey there')
})
import healthCheckRouter from './routes/healthCheck.routes.js'

app.use('/api/v1/healthcheck', healthCheckRouter)


export default app