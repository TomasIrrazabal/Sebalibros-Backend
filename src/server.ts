import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'


import { corsConfig } from "./config/cors"

import bookRouter from "./modules/books/book.router"
import userRouter from "./modules/users/user.router"
import docsRouter from "./modules/docs/docs.router"
import adminRouter from "./modules/admin/admin.router"

const app = express()

// Config

app.use(cors(corsConfig))
app.use(express.json())
app.use(cookieParser())

// Version

const apiV = `/api/v1`

// Routers
// Each router applies its own auth/role guards per route.

app.use('/docs', docsRouter)

app.use(apiV, bookRouter)
app.use(apiV, userRouter)
app.use(apiV, adminRouter)

app.use((_req, res) => {
    res.status(404).json({ error: 'URL not found' });
});


export default app