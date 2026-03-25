import express from 'express';
import authRoutes from './routes/auth.routes.js'
import memberRoutes from './routes/member.routes.js';
import borrowRoutes from './routes/borrow.routes.js';
import bookRoutes from './routes/book.routes.js';
import categoryRoutes from './routes/category.routes.js';
import statsRoutes from './routes/stats.routes.js';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();

app.use(helmet())
app.use(express.json())
const limiter = rateLimit({
    windowMs:15*60*1000,
    max :100
});
app.use(limiter);
app.use(cors({
    origin: true,
    credentials: true
}));

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/borrows', borrowRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/stats', statsRoutes);

//gestion des images dans books
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

app.use('/uploads', express.static(path.join(dirname, 'uploads')));
export default app;