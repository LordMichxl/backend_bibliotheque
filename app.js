import express from 'express';
import authRoutes from './routes/auth.routes.js'
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';


const app = express();
app.use(helmet())
app.use(express.json())
const limiter = rateLimit({
    windows:15*60*1000,
    max :100
});
app.use(cors({
    origin: "http://localhost:3000"
}))
app.get('/', (req, res ,err ) => {
    if(err) {
        console.error(err);
        return res.status(500).json('Internal Server Error'); // json permet d'envoyer une réponse au format JSON, send permet d'envoyer une réponse au format texte
    }
    res.status(403).json('Accesss refused');

});

app.use('/api/auth', authRoutes);

export default app;