import { CorsOptions } from 'cors'

function buildWhiteList() {
    const whiteList = [process.env.FRONTEND_URL]

    if (process.argv[2] === '--api') {
        whiteList.push(undefined)
    }

    return whiteList.filter(Boolean) as string[];
}

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {

        const whiteList = buildWhiteList()

        if (!origin) return callback(null, true)

        if (whiteList.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('CORS Error'))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}
