import express from "express"
import cors from 'cors'
import routerLibros from "./routes/book.router"
import routerImages from './routes/image.router'
import { corsConfig } from "./config/cors"

const app = express()



app.use(cors(corsConfig))
app.use(express.json()) //  middleware que transforma la req.body a un json

const apiV1 = `/api/v1`

app.use(apiV1 + '/image', routerImages)
app.use(apiV1 + '/book', routerLibros)

export default app