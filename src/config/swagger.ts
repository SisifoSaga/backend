import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerUiOptions } from 'swagger-ui-express';

const options: swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.2',
        tags: [
            {
                name: 'Products',
                description: 'API operations related to products',
            },
        ],
        info: {
            title: 'REST API Node.js / Express / TypeScript',
            version: '1.0.0',
            description: 'API Docs for Products',
        },
    },
    apis: ['./src/router.ts'], // Ajusta según la ubicación de tus rutas
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerUiOptions: SwaggerUiOptions = {
    customCss: `
        .swagger-ui .topbar {
            background-color: #2b3b45;
        }
        .swagger-ui .topbar-wrapper .link {
            display: none; /* Oculta el logotipo predeterminado de Swagger */
        }
        .swagger-ui .topbar-wrapper::before {
            content: '';
            display: inline-block;
            background: url('/logo.png') no-repeat center;
            background-size: contain;
            width: 50px;
            height: 50px;
            margin-right: 10px;
        }
        .swagger-ui .topbar-wrapper {
            display: flex;
            align-items: center;
        }
    `,
    customSiteTitle: 'Documentación REST API Express / TypeScript',
};





// Exporta todo como named exports
export { swaggerSpec, swaggerUiOptions };
