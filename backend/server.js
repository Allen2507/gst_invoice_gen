// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const invoiceRoutes = require('./routes/invoiceRoutes');

// dotenv.config();
// connectDB();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use('/api', invoiceRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const invoiceRoutes = require('./routes/invoiceRoutes');

dotenv.config();

// Connect to database
connectDB().catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1);
});

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // update FRONTEND_URL in .env if needed
}));
app.use(express.json());

// Routes
//  CORRECT
app.use('/api/invoices', invoiceRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
