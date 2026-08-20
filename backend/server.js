const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/routes/apiRoutes');
const { startReservationWorker } = require('./src/services/inventoryService');

const app = express();
app.use(cors());
app.use(express.json());

startReservationWorker();

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`D2C Multi-Brand Engine running on port ${PORT}`);
});