const express = require('express');
const cors = require('cors');
const commerceRoutes = require('./routes/commerceRoutes');


const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use('/api/commerce', commerceRoutes);

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto: ${port}`);
})