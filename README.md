src/
 ├── models/
 │    └── Libro.ts          # Modelo Libro (estructura + conexión DB)
 ├── controllers/
 │    └── libro.controller.ts # Controlador con lógica de negocio
 ├── routes/
 │    └── libro.routes.ts     # Rutas de la API
 ├── views/ (opcional si usas EJS/PUG)
 │    └── catalogo.ejs
 ├── app.ts                  # Configuración principal Express
 └── server.ts  


 ✅ Checklist de “MVC correcto”

 Models: tipos/entidades en models/.

 Controllers: sin lógica de negocio — sólo req/res.

 Services: toda la lógica (lectura JSON, filtros, etc.).

 Routes: nada de lógica, sólo mapping.

 Middlewares: 404 y errorHandler global.

 Config: CORS, .env, etc.

 Static: express.static para servir imágenes (/static/libros/...).

🧪 Peticiones ejemplo desde el front

Listado: GET http://localhost:3000/api/v1/libros

Detalle: GET http://localhost:3000/api/v1/libros/3

Especialidades: GET http://localhost:3000/api/v1/libros/especialidades

Imagen: <img src="http://localhost:3000/static/libros/mi_portada.png" />

