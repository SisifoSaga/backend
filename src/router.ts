import { Router } from 'express';
import { body, param } from 'express-validator';
import { createProduct, getProductById, getProducts } from './handlers/product';
import { handleInputErrors } from './middleware';

const router = Router();

// Routing
router.get('/', getProducts)
router.get('/:id',
    param('id').isInt().withMessage('ID no valido'),
    handleInputErrors,
    
    getProductById
)

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
    res.json('Desde PUT')
});

router.delete('/', (req, res) => {
    res.json('Desde DELETE')
})

export default router
