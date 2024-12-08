import { Router } from 'express';
import { body } from 'express-validator';
import { createProduct } from './handlers/product';
import { handleInputErrors } from './middleware';

const router = Router();

// Rutas
router.get('/', (req, res) => {
    res.json('Desde GET');
});

router.post(
    '/',
    [
        // Validaciones
        body('name').notEmpty().withMessage('El nombre del producto no puede ir vacío'),
        body('price')
            .isNumeric().withMessage('El precio debe ser un número')
            .notEmpty().withMessage('El precio del producto no puede ir vacío')
            .custom((value) => value > 0).withMessage('El precio debe ser mayor que 0'),
    ],
    handleInputErrors,
    createProduct // Controlador después de validaciones
);

router.put('/', (req, res) => {
    res.json('Desde PUT');
});

router.delete('/', (req, res) => {
    res.json('Desde DELETE');
});

export default router;
