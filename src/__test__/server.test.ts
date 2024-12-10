import { connectDB } from '../server'
import db from '../config/db'

jest.mock('../config/db')

/**
 * @description Prueba unitaria para la función `connectDB`, que verifica el manejo adecuado de errores
 * en la conexión a la base de datos. La función debe registrar un mensaje de error en la consola
 * si la autenticación de la base de datos falla.
 */
describe('connectDB', () => {
    it('should handle database connection error', async () => {
        // Simula un error en la autenticación de la base de datos
        jest.spyOn(db, 'authenticate')
            .mockRejectedValueOnce(new Error('Hubo un error al conectar a la BD'));

        // Espía la función console.log para verificar el mensaje de error
        const consoleSpy = jest.spyOn(console, 'log');

        // Ejecuta la función que se está probando
        await connectDB();

        // Comprueba que console.log fue llamado con el mensaje de error esperado
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Hubo un error al conectar a la BD')
        );
    });
});
