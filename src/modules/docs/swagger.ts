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
        { name: 'Admin', description: 'Admin-only operations' },
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
            UserResponse: {
                type: 'object',
                properties: { user: { $ref: '#/components/schemas/User' } },
            },
            UsersResponse: {
                type: 'object',
                properties: { users: { type: 'array', items: { $ref: '#/components/schemas/User' } } },
            },
            UpdateUserRequest: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                },
            },
            UpdatePasswordRequest: {
                type: 'object',
                properties: {
                    currentPassword: { type: 'string' },
                    newPassword: { type: 'string', minLength: 8 },
                },
                required: ['currentPassword', 'newPassword'],
            },
            UpdateAdminUserRequest: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    role: { type: 'string', enum: ['admin', 'editor'] },
                    resetPass: { type: 'boolean' },
                },
                required: ['id'],
            },
            DeleteImageRequest: {
                type: 'object',
                properties: {
                    originalImage: { type: 'string' },
                    image: { type: 'string' },
                },
                required: ['originalImage'],
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
                tags: ['Admin'],
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
                tags: ['Admin'],
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
                tags: ['Admin'],
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
                tags: ['Admin'],
                summary: 'Delete associated image',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/DeleteImageRequest' } } },
                },
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
            patch: {
                tags: ['Users'],
                summary: 'Update my account',
                security: [{ cookieAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateUserRequest' } } } },
                responses: {
                    200: { description: 'Updated user', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserResponse' } } } },
                    400: { description: 'Bad request' },
                    401: { description: 'Unauthorized' },
                    409: { description: 'Email already exist' },
                },
            },
        },
        '/password': {
            patch: {
                tags: ['Users'],
                summary: 'Update my password',
                security: [{ cookieAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdatePasswordRequest' } } } },
                responses: {
                    200: { description: 'Password changed', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
                    400: { description: 'Bad request' },
                    401: { description: 'Unauthorized' },
                    409: { description: 'Invalid password or user not found' },
                },
            },
        },
        '/admin/user': {
            get: {
                tags: ['Admin'],
                summary: 'Get all users (admin)',
                security: [{ cookieAuth: [] }],
                responses: {
                    200: { description: 'Users list', content: { 'application/json': { schema: { $ref: '#/components/schemas/UsersResponse' } } } },
                    401: { description: 'Unauthorized' },
                },
            },
            post: {
                tags: ['Admin'],
                summary: 'Create user',
                security: [{ cookieAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateUserRequest' } } } },
                responses: {
                    201: { description: 'User created', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                    400: { description: 'Validation error' },
                    401: { description: 'Unauthorized' },
                },
            },
            patch: {
                tags: ['Admin'],
                summary: 'Update a user (admin)',
                security: [{ cookieAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateAdminUserRequest' } } } },
                responses: {
                    200: { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
                    400: { description: 'Validation error' },
                    401: { description: 'Unauthorized' },
                },
            },
        },
        '/admin/user/{id}': {
            get: {
                tags: ['Admin'],
                summary: 'Get a user (admin)',
                security: [{ cookieAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'User', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                    401: { description: 'Unauthorized' },
                    404: { description: 'Not found' },
                },
            },
            delete: {
                tags: ['Admin'],
                summary: 'Delete a user (admin)',
                security: [{ cookieAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    204: { description: 'Deleted' },
                    401: { description: 'Unauthorized' },
                },
            },
        },
    },
};

export const swaggerSpec = swaggerJsDoc({ definition: swaggerDefinition, apis: [] });
