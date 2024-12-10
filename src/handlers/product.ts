import { Request, Response } from 'express';
import Product from '../models/Product.model';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await Product.findAll({
            order: [['id', 'DESC']],
        });
        res.status(200).json({ data: products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            res.status(404).json({ error: 'Producto No Encontrado' });
            return;
        }

        res.status(200).json({ data: product });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ data: product });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            res.status(404).json({ error: 'Producto No Encontrado' });
            return;
        }

        // Actualizar producto
        await product.update(req.body);
        res.status(200).json({ data: product });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

export const updateAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            res.status(404).json({ error: 'Producto No Encontrado' });
            return;
        }

        // Actualizar disponibilidad
        product.availability = !product.dataValues.availability;
        await product.save();
        res.status(200).json({ data: product });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la disponibilidad' });
    }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            res.status(404).json({ error: 'Producto No Encontrado' });
            return;
        }

        // Eliminar producto
        await product.destroy();
        res.status(200).json({ data: 'Producto Eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};
