import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'

import bookRouter from "./modules/books/book.router"
import userRouter from "./modules/users/user.router"
import docsRouter from "./modules/docs/docs.router"
import { corsConfig } from "./config/cors"
import { swaggerSpec } from "./modules/docs/swagger";

const app = express()

// Config

app.use(cors(corsConfig))
app.use(express.json())
app.use(cookieParser())

// Version

const apiV = `/api/v1`

// Routers

app.use('/docs', docsRouter)

app.use(apiV, bookRouter)
app.use(apiV, userRouter)


app.use((_req, res) => {
    res.status(404).json({ error: 'URL not found' });
});


export default app