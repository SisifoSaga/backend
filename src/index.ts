import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors({
    origin: ['https://frontend-five-tau.vercel.app', 'http://localhost:4000'], // Agrega tu dominio de Vercel
    credentials: true, // Si usas cookies o headers personalizados
}));
