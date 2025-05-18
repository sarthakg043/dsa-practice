# DSA Repository Tracker Frontend

This is a React application that automatically visualizes and tracks your progress in solving Data Structures and Algorithms (DSA) problems.

## Features

- 📊 Live visualization of your progress with charts and statistics
- 📁 File explorer to browse your repository structure
- 📝 Markdown rendering for problem descriptions and solutions
- 📈 Track problems by difficulty (Easy, Medium, Hard)
- 📊 See category distribution with interactive charts
- 🔄 Auto-refresh to detect changes in your repository

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the application:
```bash
npm start
```

This will start both the backend API server and the frontend development server.

## How It Works

The application automatically:

1. Scans your DSA repository folder structure
2. Parses README.md files to extract progress statistics
3. Identifies solution files and their difficulty levels
4. Generates charts and visualizations based on your progress

## Adding New Problems

When you add new problems or solutions:

1. Follow the established folder structure:
   - Topic folder (e.g., "Arrays & Hashing")
   - README.md in each topic folder with problem listings
   - Individual solution files

2. Update the progress in your topic README.md file:
   ```
   ## Completion Status
   
   - Completed: X/Y
   - Progress: Z%
   ```

3. The application will automatically detect these changes when you refresh.

## Technology Stack

- React
- TailwindCSS
- ShadcnUI
- Recharts for data visualization
- Express.js for the backend API

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
