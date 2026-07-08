import 'dotenv/config';
import http from 'http';
import app from '@/app';
import connectDB from '@/config/db';

const port = process.env.PORT || 5000;

// Create the HTTP server using the Express app
export const server = http.createServer(app);

// Handle uncaught exceptions globally
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Function to start the server and connect to the database
export const startServer = async () => {
  try {
    await connectDB();

    server.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (err: any) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});
