import { Router } from "express";
import { swaggerSpec } from "./swagger";
import swaggerUi from 'swagger-ui-express';

const router = Router();

router.get('/openapi.json', (_req, res) => {
    res.type('application/json').send(swaggerSpec) // o res.json(swaggerSpec)
})

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }))



export default router