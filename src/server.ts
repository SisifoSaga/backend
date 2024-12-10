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

// Configuración de CORS
const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        // Permitir solicitudes desde FRONTEND_URL o sin origen (Swagger/Postman)
        if (!origin || origin === process.env.FRONTEND_URL) {
            callback(null, true);
        } else {
            callback(new Error('Error de CORS'));
        }
    },
};

// Aplicar CORS solo a las rutas de la API
server.use('/api', cors(corsOptions));

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

// Exportar el servidor
export default server;
