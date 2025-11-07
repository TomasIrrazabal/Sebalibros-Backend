import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express';

import bookRouter from "./modules/books/book.router"
import UserRouter from "./modules/users/user.router"
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


app.use(apiV, bookRouter)
app.use(apiV, UserRouter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use((_req, res) => {
    res.status(404).json({ error: 'URL not found' });
});


export default app