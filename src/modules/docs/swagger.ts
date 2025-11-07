import swaggerJsDoc from 'swagger-jsdoc';
export const swaggerSpec = swaggerJsDoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SebaLibros API',
            version: '1.0.0',
            description: 'Documentación del backend REST con Express + Supabase'
        },
        servers: [{ url: 'http://localhost:3000/api/v1' }],
    },
    apis: ['./src/modules/**/*.ts'],
});