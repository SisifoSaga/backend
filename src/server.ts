import express from 'express';
import colors from 'colors';
import cors, {CorsOptions} from 'cors'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec, swaggerUiOptions } from './config/swagger'; // Importa como named exports
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

// Permitir Conexiones
const corsOptions : CorsOptions = {
    origin: function(origin, callback){
        if(origin == process.env.FRONTEND_URL){
            callback(null, true)
        }else{
            callback(new Error('Error de CORS'))
        }
    }
}
server.use(cors(corsOptions))

// Middleware para leer datos de formularios
server.use(express.json());

// Configurar carpeta pública para servir archivos estáticos
server.use(express.static(path.join(__dirname, '../public')));

server.use(morgan('dev'))

// Rutas de productos
server.use('/api/products', router);

// Documentación Swagger
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

server.use(express.static(path.join(__dirname, '../public')));

// Exportar el servidor
export default server;
