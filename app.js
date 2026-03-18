import express from 'express';
const app = express();

app.get('/', (req, res ,err ) => {
    if(err) {
        console.error(err);
        return res.status(500).json('Internal Server Error'); // json permet d'envoyer une réponse au format JSON, send permet d'envoyer une réponse au format texte
    }
    res.status(403).json('Accesss refused');

});

export default app;