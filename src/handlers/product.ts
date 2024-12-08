import { Request, Response} from 'express'
import Product from '../models/Product.model'


export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll({
            order: [
                ['price', 'DESC']
            ], 
            attributes: {exclude: ['createdAt', 'updatedAt', 'availability']}
        })
        res.json({data: products})
    } catch (error) {
        console.log(error)
    }
}

export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params; // Captura el parámetro "id" de la solicitud
        const product = await Product.findByPk(id); // Busca el producto en la base de datos

        if (!product) {
            // Si no se encuentra el producto, responde con un 404
            res.status(404).json({
                error: 'Producto no encontrado',
            });
            return; // Detén la ejecución después de enviar la respuesta
        }

        // Responde con el producto encontrado
        res.json({ data: product });
    } catch (error) {
        console.error(error); // Registra cualquier error en la consola
        res.status(500).json({
            error: 'Error interno del servidor',
        });
    }
};

export const createProduct = async(req: Request, res: Response) => {
    try{
        const product = await Product.create(req.body)
        res.json({data: product})
    }catch (error) {
        console.log(error)
    }
}