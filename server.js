import app from './app.js';
import dotenv from 'dotenv';
import { sequelize } from './models/index.js';

dotenv.config();

sequelize.sync().then(() => { 
    app.listen(process.env.PORT || 5000, () => {
    console.log(`Serveur is running on port ${process.env.PORT || 5000}`);
    }); 
    console.log('Database synchronized');
}).catch((error) => {
    console.error('Unable to synchronize the database:', error);
    
});