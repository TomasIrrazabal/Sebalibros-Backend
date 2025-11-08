import swaggerJsDoc, { OAS3Definition } from 'swagger-jsdoc';

// OpenAPI 3.0 specification for all routes in the project.
// This definition does not rely on JSDoc comments so docs render fully
// even if routes don’t include annotations.
const swaggerDefinition: OAS3Definition = {
    openapi: '3.0.0',
    info: {
        title: 'SebaLibros API',
        version: '1.0.0',
        description: 'REST API documentation for SebaLibros (Express + Supabase)',
    },
    servers: [
        { url: 'http://localhost:3000/api/v1', description: 'Local' },
    ],
    tags: [
        { name: 'Books', description: 'Books management' },
        { name: 'Users', description: 'Authentication and users' },
    ],
    components: {
        securitySchemes: {
            cookieAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'auth',
                description: 'httpOnly authentication cookie named "auth"',
            },
        },
        schemas: {
            ErrorResponse: {
                type: 'object',
                properties: { error: { type: 'string' } },
            },
            MessageResponse: {
                type: 'object',
                properties: { message: { type: 'string' } },
            },
            Book: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    isbn: { type: 'string' },
                    title: { type: 'string' },
                    author: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' },
                    imageUrl: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    image: { type: 'string' },
                    format: { type: 'string' },
                    bookBinding: { type: 'string' },
                    resume: { type: 'string' },
                    pages: { type: 'number' },
                    especility: { type: 'string' },
                    state: { type: 'enum', enum: ['active | unactive'] }
                },
            },
            CreateBookInput: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    isbn: { type: 'string' },
                    title: { type: 'string' },
                    author: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' },
                    imageUrl: { type: 'string' },
                    image: { type: 'string' },
                    format: { type: 'string' },
                    bookBinding: { type: 'string' },
                    resume: { type: 'string' },
                    pages: { type: 'number' },
                    especility: { type: 'string' },
                    state: { type: 'enum', enum: ['active | unactive'] }
                },
                required: ['id', 'isbn', 'author', 'price', 'image'],
            },
            UpdateBookInput: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    isbn: { type: 'string' },
                    title: { type: 'string' },
                    author: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' },
                    imageUrl: { type: 'string' },
                    image: { type: 'string' },
                    format: { type: 'string' },
                    bookBinding: { type: 'string' },
                    resume: { type: 'string' },
                    pages: { type: 'number' },
                    especility: { type: 'string' },
                    state: { type: 'enum', enum: ['active | inactive'] }
                },
                required: ['id'],
            },
            User: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                },
            },
            LoginRequest: {
                type: 'object',
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                },
                required: ['email', 'password'],
            },
            CreateUserRequest: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 8 },
                },
                required: ['name', 'email', 'password'],
            },
        },
    },
    paths: {
        '/books': {
            get: {
                tags: ['Books'],
                summary: 'List books',
                responses: {
                    200: {
                        description: 'Books list',
                        content: {
                            'application/json': {
                                schema: { type: 'array', items: { $ref: '#/components/schemas/Book' } },
                            },
                        },
                    },
                },
            },
        },
        '/books/{id}': {
            get: {
                tags: ['Books'],
                summary: 'Get book by ID',
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
                ],
                responses: {
                    200: {
                        description: 'Book found',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/Book' } } },
                    },
                    404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                },
            },
        },
        '/admin/book': {
            post: {
                tags: ['Books'],
                summary: 'Create book',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': { schema: { $ref: '#/components/schemas/CreateBookInput' } },
                    },
                },
                responses: {
                    201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Book' } } } },
                    400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    401: { description: 'Unauthorized' },
                },
            },
            patch: {
                tags: ['Books'],
                summary: 'Update book',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': { schema: { $ref: '#/components/schemas/UpdateBookInput' } },
                        'application/json': { schema: { $ref: '#/components/schemas/UpdateBookInput' } },
                    },
                },
                responses: {
                    200: { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Book' } } } },
                    400: { description: 'Validation error' },
                    401: { description: 'Unauthorized' },
                },
            },
        },
        '/admin/book/{id}': {
            delete: {
                tags: ['Books'],
                summary: 'Delete book',
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
                ],
                responses: {
                    204: { description: 'Deleted' },
                    401: { description: 'Unauthorized' },
                },
            },
        },
        '/image': {
            delete: {
                tags: ['Books'],
                summary: 'Delete associated image',
                security: [{ cookieAuth: [] }],
                responses: {
                    200: { description: 'Deleted', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
                    401: { description: 'Unauthorized' },
                },
            },
        },
        '/login': {
            post: {
                tags: ['Users'],
                summary: 'Login',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
                },
                responses: {
                    200: { description: 'Authenticated (cookie set)', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
                    400: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                },
            },
        },
        '/admin/createuser': {
            post: {
                tags: ['Users'],
                summary: 'Create user',
                security: [{ cookieAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateUserRequest' } } } },
                responses: {
                    201: { description: 'User created', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                    400: { description: 'Validation error' },
                    401: { description: 'Unauthorized' },
                },
            },
        },
        '/logout': {
            get: {
                tags: ['Users'],
                summary: 'Logout',
                responses: {
                    200: { description: 'Logged out', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
                },
            },
        },
        '/user': {
            get: {
                tags: ['Users'],
                summary: 'Get authenticated user',
                security: [{ cookieAuth: [] }],
                responses: {
                    200: { description: 'User', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                    401: { description: 'Unauthorized' },
                },
            },
        },
    },
};

export const swaggerSpec = swaggerJsDoc({ definition: swaggerDefinition, apis: [] });
