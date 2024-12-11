import express from 'express';
import colors from 'colors';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec, swaggerUiOptions } from './config/swagger';
import router from './router';
import db from './config/db';
import path from 'path';

// Conectar a base de datos
export async function connectDB() {
    try {
        await db.authenticate();
        db.sync();
        console.log(colors.blue('Conexión exitosa a la BD'));
    } catch (error) {
        console.log(colors.red.bold('Hubo un error al conectar a la BD'));
    }
}
connectDB();

// Instancia única de express
const server = express();

import cors, { CorsOptions } from 'cors';

// Configuración de CORS para permitir todos los orígenes
const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        console.log('Solicitud desde el origen:', origin); // Log para depurar
        if (!origin || origin === process.env.FRONTEND_URL) {
            console.log('Origen permitido:', origin); // Log para confirmar
            callback(null, true); // Permitir el origen FRONTEND_URL
        } else {
            console.warn('Origen no listado explícitamente, pero permitido:', origin); // Permitir otros orígenes
            callback(null, true); // Permitir todos los demás orígenes
        }
    },
    credentials: true, // Permitir el envío de cookies y encabezados de autorización
};

// Aplicar CORS globalmente
server.use(cors(corsOptions));

// Configurar CORS sin restricciones para Swagger
server.use(
    '/docs',
    cors(), // Swagger no tiene restricciones de origen
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

// Middleware para leer datos de formularios
server.use(express.json());

// Configurar carpeta pública para servir archivos estáticos
server.use(express.static(path.join(__dirname, '../public')));

// Middleware de registro HTTP
server.use(morgan('dev'));

// Rutas de productos
server.use('/api/products', router);

// Ruta base
server.get('/', (req, res) => {
    res.send('Bienvenido a la API');
});

// Exportar el servidor
export default server;

