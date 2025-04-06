
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const investRoutes = require('./routes/investRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/invest', investRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
