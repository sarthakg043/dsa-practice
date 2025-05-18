# DSA Repository Tracker - Vercel Deployment Guide

## Deployment Instructions

### 1. Push to GitHub

First, push your repository to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### 2. Deploy on Vercel

1. Visit [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click "Add New..." > "Project"
3. Select your DSA repository
4. Vercel should automatically detect your configuration
5. Click "Deploy" and wait for the build to complete

### 3. Environment Variables

No environment variables are required for basic deployment.

### 4. Project Structure

The project is set up for Vercel deployment with:

- Frontend: Vite React application in `/frontend`
- API: Serverless Express API in `/api`
- `vercel.json`: Configuration for routing and builds

### 5. API Configuration

The serverless API has been configured to:

- Use CommonJS modules for compatibility with Vercel
- Provide CORS headers to prevent cross-origin issues
- Return mock data since the file system can't be accessed directly
- Handle errors properly with appropriate HTTP status codes

### 6. Notes on Serverless Limitations

Since Vercel uses a serverless infrastructure:

- File operations cannot use the filesystem directly (using mock data instead)
- Statistics are not automatically persisted between sessions (consider using a database)
- For a complete solution, consider using MongoDB, Supabase, or another database service

## Local Development

To run locally:

```bash
# Start the frontend
cd frontend
npm install
npm run dev

# In another terminal, start the API
cd api
npm install express
node index.js
```

## Troubleshooting

If you encounter issues:

1. Check the Vercel build logs for any errors
2. Check the Network tab in your browser developer tools for API errors
3. Ensure all API paths use relative URLs (`/api/...` instead of absolute URLs)
4. If you see "Unexpected token '<'" errors, the API is returning HTML instead of JSON:
   - Verify the API routes are correctly configured in vercel.json
   - Check that response headers include proper Content-Type
   - Make sure error handling returns JSON, not HTML error pages

## Additional Configuration

For advanced deployments, consider:

- Connecting a database (MongoDB, Supabase, etc.) for persistent statistics
- Setting up custom domains
- Configuring build caching for faster deployments
- Using environment variables to control application behavior
