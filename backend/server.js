const connectDB = require('./config/db');
const app = require('./app');

const port = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(port, () => console.log(`Doctor Hub API running on port ${port}`)))
  .catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
