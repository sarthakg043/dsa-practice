// A serverless function handler for Vercel
import app from './server';

export default (req, res) => {
  // Handle the request using the Express app
  app(req, res);
};
