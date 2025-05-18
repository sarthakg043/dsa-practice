# DSA Repository Tracker - Testing & Deployment Guide

## Testing Locally

### Starting the Application

1. First, install dependencies for both the frontend and API:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install API dependencies
cd ../api
npm install express
```

2. Start the API and frontend in separate terminals:

```bash
# Terminal 1: Start the API
cd api
node index.js

# Terminal 2: Start the frontend
cd frontend
npm run dev
```

3. Open the frontend in your browser (typically at http://localhost:5173)

### Testing API Endpoints

You can test the API endpoints directly using curl or a tool like Postman:

```bash
# Test the tree endpoint
curl http://localhost:3000/api/tree

# Test the file endpoint
curl http://localhost:3000/api/file?path=/Arrays/two-sum.md

# Test the statistics endpoint
curl -X POST -H "Content-Type: application/json" -d '{"test":"data"}' http://localhost:3000/api/statistics
```

## Vercel Deployment

### Prerequisites

1. A GitHub account with your repository pushed
2. A Vercel account (you can sign up at vercel.com using your GitHub account)

### Deployment Steps

1. Push your changes to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

2. Log in to Vercel and create a new project:
   - Click "Add New..." > "Project"
   - Import your GitHub repository
   - Vercel should automatically detect the configuration from vercel.json
   - Click "Deploy"

3. Watch the deployment logs for any errors

4. Once deployed, Vercel will provide you with a URL to access your application

### Troubleshooting Deployment Issues

If you encounter any issues during deployment:

1. Check the Vercel deployment logs for errors
2. Verify your vercel.json configuration is correct
3. Check that all paths in your code are properly formatted for deployment
4. Make sure your API is properly set up to work in a serverless environment

## Common Issues and Solutions

### "Unexpected token '<', '<!doctype '... is not valid JSON" Error

This error occurs when:
- The API returns HTML instead of JSON
- A route that should exist doesn't exist, and you get an HTML 404 page instead

Solutions:
- We've updated the API to always return JSON by:
  - Setting the correct Content-Type header
  - Intercepting any HTML responses and converting them to JSON
  - Adding proper error handlers for all routes

### Vercel File System Limitations

In Vercel's serverless environment, you can't:
- Write to the filesystem
- Access files that aren't part of the deployment
- Use relative paths outside your function directory

Solutions:
- Use mock data for files and directory structure
- Employ a database for persistent storage
- Use environment variables for configuration

### CORS Issues

If the frontend can't access the API due to CORS errors:

Solutions:
- We've set CORS headers in the API to allow all origins
- Headers are configured in both vercel.json and the Express middleware
