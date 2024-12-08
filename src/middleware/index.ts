import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const handleInputErrors = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Envía una respuesta de error y detiene el flujo
        res.status(400).json({ errors: errors.array() });
        return; // Detiene el flujo para evitar llamar a `next`
    }

    // Continúa con el siguiente middleware si no hay errores
    next();
};
