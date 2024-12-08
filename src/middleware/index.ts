import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const handleInputErrors = (req: Request, res: Response, next: NextFunction): void => {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Retornar errores si existen
        res.status(400).json({ errors: errors.array() });
        return; // Detener la ejecución
    }

    // Pasar al siguiente middleware si no hay errores
    next();
};
