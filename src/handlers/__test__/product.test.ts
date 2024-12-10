import request from 'supertest'
import server from '../../server'

/**
 * @description Pruebas unitarias para la ruta `POST /api/products`, verificando la validación de datos
 * y la creación de nuevos productos en la base de datos.
 */

describe('POST /api/products', () => {
    /**
     * @description Verifica que se muestren mensajes de validación cuando los datos enviados están incompletos o son incorrectos.
     */
    it('should display validation errors', async () => {
        const response = await request(server).post('/api/products').send({});

        // Comprueba que la respuesta tenga estado 400 (errores de validación)
        expect(response.status).toBe(400);

        // Verifica que el cuerpo de la respuesta contenga un arreglo de errores
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(4);

        // Comprueba que no sea un estado 404 y que el número de errores no sea incorrecto
        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(2);
    })

    /**
     * @description Valida que el precio de un producto sea mayor a 0.
     */
    it('should validate that the price is greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Monitor Curvo',
            price: 0
        })

        // Comprueba que la respuesta tenga estado 400 (error de validación)
        expect(response.status).toBe(400);

        // Verifica que el cuerpo de la respuesta contenga un arreglo de errores con un solo error
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);

        // Comprueba que no sea un estado 404 y que el número de errores no sea incorrecto
        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(2);
    })

    /**
     * @description Valida que el precio sea un número y mayor a 0.
     */
    it('should validate that the price is a number and greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Monitor Curvo',
            price: "Hola"
        })

        // Comprueba que la respuesta tenga estado 400 (error de validación)
        expect(response.status).toBe(400);

        // Verifica que el cuerpo de la respuesta contenga un arreglo de errores con dos errores
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(2);

        // Comprueba que no sea un estado 404 y que el número de errores no sea incorrecto
        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(4);
    })

    /**
     * @description Verifica que se pueda crear un nuevo producto con datos válidos.
     */
    it('should create a new product', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Mouse - Testing",
            price: 50
        });

        // Comprueba que la respuesta tenga estado 201 (creado)
        expect(response.status).toEqual(201);

        // Verifica que el cuerpo de la respuesta contenga los datos del producto creado
        expect(response.body).toHaveProperty('data');

        // Asegura que no sea un estado incorrecto ni contenga errores
        expect(response.status).not.toBe(404);
        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty('errors');
    })
})

/**
 * @description Pruebas unitarias para la ruta `GET /api/products`, verificando la existencia de la ruta y 
 * la estructura de la respuesta al obtener la lista de productos.
 */

describe('GET /api/products', () => {
    /**
     * @description Verifica que la URL `/api/products` exista en el servidor.
     */
    it('should check if api/products url exists', async () => {
        const response = await request(server).get('/api/products');

        // Comprueba que la respuesta no sea un estado 404 (no encontrado)
        expect(response.status).not.toBe(404);
    });

    /**
     * @description Verifica que la respuesta sea JSON y contenga una lista de productos.
     */
    it('GET a JSON response with products', async () => {
        const response = await request(server).get('/api/products')

        // Comprueba que el estado de la respuesta sea 200 (éxito)
        expect(response.status).toBe(200)

        // Verifica que el encabezado de la respuesta sea de tipo JSON
        expect(response.headers['content-type']).toMatch(/json/)

        // Asegura que la respuesta contenga la propiedad 'data' con una lista de productos
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)

        // Verifica que no existan errores en la respuesta
        expect(response.body).not.toHaveProperty('errors')
    })
})


/**
 * @description Pruebas unitarias para la ruta `GET /api/products/:id`, verificando la respuesta 
 * para productos existentes, no existentes, y la validación del formato del ID en la URL.
 */

describe('GET /api/products/:id', () => {
    /**
     * @description Verifica que se retorne una respuesta 404 para un producto que no existe.
     */
    it('Should return a 404 response for a non-existent product', async () => {
        const productId = 2000;
        const response = await request(server).get(`/api/products/${productId}`);

        // Comprueba que el estado sea 404 (no encontrado)
        expect(response.status).toBe(404);

        // Verifica que el cuerpo de la respuesta contenga un mensaje de error
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Producto No Encontrado');
    });

    /**
     * @description Verifica que se valide correctamente el formato del ID en la URL.
     */
    it('should check a valid ID in the URL', async () => {
        const response = await request(server).get('/api/products/not-valid-url');

        // Comprueba que el estado sea 400 (solicitud incorrecta)
        expect(response.status).toBe(400);

        // Verifica que el cuerpo de la respuesta contenga un arreglo de errores con un solo mensaje
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('ID no válido');
    });

    /**
     * @description Verifica que la respuesta para un producto existente sea un JSON con los datos del producto.
     */
    it('get a JSON response for a single product', async () => {
        const response = await request(server).get('/api/products/1');

        // Comprueba que el estado sea 200 (éxito)
        expect(response.status).toBe(200);

        // Verifica que el cuerpo de la respuesta contenga los datos del producto
        expect(response.body).toHaveProperty('data');
    });
});

/**
 * @description Pruebas unitarias para la ruta `PUT /api/products/:id`, verificando la validación de datos,
 * la actualización de productos existentes y el manejo de errores relacionados con el ID y los datos enviados.
 */

describe('PUT /api/products/:id', () => {
    /**
     * @description Valida que el ID en la URL sea correcto.
     */
    it('should check a valid ID in the URL', async () => {
        const response = await request(server)
                            .put('/api/products/not-valid-url')
                            .send({
                                name: "Monitor Curvo",
                                availability: true,
                                price: 300,
                            });

        // Comprueba que el estado sea 400 (ID no válido)
        expect(response.status).toBe(400);

        // Verifica que el cuerpo de la respuesta contenga errores
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('ID no válido');
    });

    /**
     * @description Muestra mensajes de error de validación al intentar actualizar un producto con datos incompletos.
     */
    it('should display validation error messages when updating a product', async () => {
        const response = await request(server).put('/api/products/1').send({});

        // Comprueba que el estado sea 400 (errores de validación)
        expect(response.status).toBe(400);

        // Verifica que el cuerpo de la respuesta contenga un arreglo de errores
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toBeTruthy();
        expect(response.body.errors).toHaveLength(5);

        // Asegura que no se retorne un estado exitoso ni datos del producto
        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty('data');
    });

    /**
     * @description Valida que el precio de un producto sea mayor a 0 al intentar actualizarlo.
     */
    it('should validate that the price is greater than 0', async () => {
        const response = await request(server)
                                .put('/api/products/1')
                                .send({
                                    name: "Monitor Curvo",
                                    availability: true,
                                    price: 0,
                                });

        // Comprueba que el estado sea 400 (precio no válido)
        expect(response.status).toBe(400);

        // Verifica que el cuerpo de la respuesta contenga errores
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toBeTruthy();
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('Precio no válido');

        // Asegura que no se retorne un estado exitoso ni datos del producto
        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty('data');
    });

    /**
     * @description Retorna una respuesta 404 si se intenta actualizar un producto inexistente.
     */
    it('should return a 404 response for a non-existent product', async () => {
        const productId = 2000;
        const response = await request(server)
                                .put(`/api/products/${productId}`)
                                .send({
                                    name: "Monitor Curvo",
                                    availability: true,
                                    price: 300,
                                });

        // Comprueba que el estado sea 404 (producto no encontrado)
        expect(response.status).toBe(404);

        // Verifica que el cuerpo de la respuesta contenga un mensaje de error
        expect(response.body.error).toBe('Producto No Encontrado');

        // Asegura que no se retorne un estado exitoso ni datos del producto
        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty('data');
    });

    /**
     * @description Actualiza un producto existente con datos válidos.
     */
    it('should update an existing product with valid data', async () => {
        const response = await request(server)
                                .put(`/api/products/1`)
                                .send({
                                    name: "Monitor Curvo",
                                    availability: true,
                                    price: 300,
                                });

        // Comprueba que el estado sea 200 (actualización exitosa)
        expect(response.status).toBe(200);

        // Verifica que el cuerpo de la respuesta contenga los datos actualizados
        expect(response.body).toHaveProperty('data');

        // Asegura que no se retornen errores
        expect(response.status).not.toBe(400);
        expect(response.body).not.toHaveProperty('errors');
    });
});

/**
 * @description Pruebas unitarias para las rutas `PATCH /api/products/:id` y `DELETE /api/products/:id`.
 * Estas pruebas verifican la actualización parcial de productos y la eliminación de productos existentes.
 */

describe('PATCH /api/products/:id', () => {
    /**
     * @description Retorna una respuesta 404 para un producto que no existe.
     */
    it('should return a 404 response for a non-existing product', async () => {
        const productId = 2000;
        const response = await request(server).patch(`/api/products/${productId}`);

        // Comprueba que el estado sea 404 (producto no encontrado)
        expect(response.status).toBe(404);

        // Verifica que el cuerpo de la respuesta contenga un mensaje de error
        expect(response.body.error).toBe('Producto No Encontrado');

        // Asegura que no se retornen datos ni un estado exitoso
        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty('data');
    });

    /**
     * @description Actualiza la disponibilidad de un producto existente.
     */
    it('should update the product availability', async () => {
        const response = await request(server).patch('/api/products/1');

        // Comprueba que el estado sea 200 (actualización exitosa)
        expect(response.status).toBe(200);

        // Verifica que el cuerpo de la respuesta contenga los datos actualizados
        expect(response.body).toHaveProperty('data');
        expect(response.body.data.availability).toBe(false);

        // Asegura que no se retornen errores ni estados incorrectos
        expect(response.status).not.toBe(404);
        expect(response.status).not.toBe(400);
        expect(response.body).not.toHaveProperty('error');
    });
});

describe('DELETE /api/products/:id', () => {
    /**
     * @description Valida que el ID en la URL sea correcto.
     */
    it('should check a valid ID', async () => {
        const response = await request(server).delete('/api/products/not-valid');

        // Comprueba que el estado sea 400 (ID no válido)
        expect(response.status).toBe(400);

        // Verifica que el cuerpo de la respuesta contenga errores
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors[0].msg).toBe('ID no válido');
    });

    /**
     * @description Retorna una respuesta 404 si se intenta eliminar un producto que no existe.
     */
    it('should return a 404 response for a non-existent product', async () => {
        const productId = 2000;
        const response = await request(server).delete(`/api/products/${productId}`);

        // Comprueba que el estado sea 404 (producto no encontrado)
        expect(response.status).toBe(404);

        // Verifica que el cuerpo de la respuesta contenga un mensaje de error
        expect(response.body.error).toBe('Producto No Encontrado');

        // Asegura que no se retorne un estado exitoso
        expect(response.status).not.toBe(200);
    });

    /**
     * @description Elimina un producto existente.
     */
    it('should delete a product', async () => {
        const response = await request(server).delete('/api/products/1');

        // Comprueba que el estado sea 200 (eliminación exitosa)
        expect(response.status).toBe(200);

        // Verifica que el cuerpo de la respuesta confirme la eliminación
        expect(response.body.data).toBe("Producto Eliminado");

        // Asegura que no se retornen errores ni estados incorrectos
        expect(response.status).not.toBe(404);
        expect(response.status).not.toBe(400);
    });
});
