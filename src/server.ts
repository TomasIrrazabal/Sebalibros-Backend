import express from "express"
import cors from 'cors'
import routerLibros from "./modules/books/book.router"
import { corsConfig } from "./config/cors"

const app = express()



app.use(cors(corsConfig))
app.use(express.json()) //  middleware que transforma la req.body a un json

const apiV = `/api/v1`

app.use(apiV, routerLibros)


app.use((_req, res) => {
    res.status(404).json({ mensaje: 'URL not found' });
});


export default app