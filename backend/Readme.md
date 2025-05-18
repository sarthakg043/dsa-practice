# DSA Repository Tracker Backend API

This document provides information about the backend API endpoints for the DSA Repository Tracker application. The API provides access to the repository structure, file contents, and statistics data.

## Base URL

```
http://localhost:3000
```

## API Endpoints

### Repository Tree

Get the hierarchical structure of the DSA repository.

- **URL**: `/api/tree`
- **Method**: `GET`
- **Request Parameters**: None
- **Success Response**:
  - **Code**: 200 OK
  - **Content Example**:
    ```json
    {
      "name": "Data",
      "path": "/DSA/Data",
      "type": "directory",
      "children": [
        {
          "name": "NeetCode Blind 75",
          "path": "/DSA/Data/NeetCode Blind 75",
          "type": "directory",
          "children": [
            {
              "name": "Arrays & Hashing",
              "path": "/DSA/Data/NeetCode Blind 75/Arrays & Hashing",
              "type": "directory",
              "children": [
                {
                  "name": "contains_duplicate.md",
                  "path": "/DSA/Data/NeetCode Blind 75/Arrays & Hashing/contains_duplicate.md",
                  "type": "file"
                },
                {
                  "name": "README.md",
                  "path": "/DSA/Data/NeetCode Blind 75/Arrays & Hashing/README.md",
                  "type": "file"
                }
              ]
            }
          ]
        }
      ]
    }
    ```
- **Error Response**:
  - **Code**: 500 Internal Server Error
  - **Content**:
    ```json
    {
      "error": "Failed to build repository tree"
    }
    ```

### File Content

Get the content and metadata of a specific file.

- **URL**: `/api/file`
- **Method**: `GET`
- **Request Parameters**: 
  - `path` (required): Full path to the file
- **Success Response**:
  - **Code**: 200 OK
  - **Content Example**:
    ```json
    {
      "content": "# Contains Duplicate\n\nGiven an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.\n\n## Example 1:\n\nInput: nums = [1,2,3,1]\nOutput: true\n",
      "metadata": {
        "title": "Contains Duplicate",
        "difficulty": "Easy",
        "tags": ["array", "hash-table"],
        "solutions": [
          {
            "language": "python",
            "code": "def containsDuplicate(nums):\n    return len(nums) != len(set(nums))"
          }
        ]
      }
    }
    ```
- **Error Responses**:
  - **Code**: 400 Bad Request
    ```json
    {
      "error": "File path is required"
    }
    ```
  - **Code**: 404 Not Found
    ```json
    {
      "error": "File not found or could not be read"
    }
    ```
  - **Code**: 500 Internal Server Error
    ```json
    {
      "error": "Failed to read file"
    }
    ```

### Get Statistics

Get the statistics data for the DSA problems.

- **URL**: `/api/statistics`
- **Method**: `GET`
- **Request Parameters**: None
- **Success Response**:
  - **Code**: 200 OK
  - **Content Example**:
    ```json
    {
      "totalProblems": 75,
      "solvedProblems": 2,
      "topicStats": [
        {
          "name": "Arrays & Hashing",
          "total": 9,
          "solved": 2
        },
        {
          "name": "Two Pointers",
          "total": 5,
          "solved": 0
        }
      ],
      "difficultyStats": {
        "Easy": 25,
        "Medium": 40,
        "Hard": 10,
        "Unknown": 0
      },
      "problemDetails": {
        "Arrays & Hashing": [
          {
            "name": "Contains Duplicate",
            "difficulty": "Easy",
            "solved": true,
            "link": "https://leetcode.com/problems/contains-duplicate/",
            "solutionPath": "./contains_duplicate.md"
          }
        ]
      },
      "lastUpdated": "2025-05-18T12:00:00.000Z"
    }
    ```
- **Error Responses**:
  - **Code**: 404 Not Found
    ```json
    {
      "error": "Statistics file not found"
    }
    ```
  - **Code**: 500 Internal Server Error
    ```json
    {
      "error": "Failed to read statistics"
    }
    ```

### Update Statistics

Update the statistics data for the DSA problems.

- **URL**: `/api/statistics`
- **Method**: `POST`
- **Request Body**: Complete statistics object
  ```json
  {
    "totalProblems": 75,
    "solvedProblems": 3,
    "topicStats": [
      {
        "name": "Arrays & Hashing",
        "total": 9,
        "solved": 3
      }
    ],
    "difficultyStats": {
      "Easy": 25,
      "Medium": 40,
      "Hard": 10,
      "Unknown": 0
    },
    "problemDetails": {
      "Arrays & Hashing": [
        {
          "name": "Contains Duplicate",
          "difficulty": "Easy",
          "solved": true,
          "link": "https://leetcode.com/problems/contains-duplicate/",
          "solutionPath": "./contains_duplicate.md"
        }
      ]
    },
    "lastUpdated": "2025-05-18T14:30:00.000Z"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "message": "Statistics saved successfully"
    }
    ```
- **Error Response**:
  - **Code**: 500 Internal Server Error
  - **Content**:
    ```json
    {
      "error": "Failed to save statistics"
    }
    ```

## Data Models

### Repository Tree Node

```json
{
  "name": "string",         // Name of the file or directory
  "path": "string",         // Full path to the file or directory
  "type": "string",         // Either "file" or "directory"
  "children": [             // Only present for directories
    {
      // Child nodes with the same structure
    }
  ]
}
```

### Statistics Object

```json
{
  "totalProblems": "number",             // Total number of problems
  "solvedProblems": "number",            // Number of solved problems
  "topicStats": [                        // Statistics grouped by topic
    {
      "name": "string",                  // Topic name
      "total": "number",                 // Total problems in topic
      "solved": "number"                 // Solved problems in topic
    }
  ],
  "difficultyStats": {                   // Statistics grouped by difficulty
    "Easy": "number",                    // Count of Easy problems
    "Medium": "number",                  // Count of Medium problems
    "Hard": "number",                    // Count of Hard problems
    "Unknown": "number"                  // Count of problems with unknown difficulty
  },
  "problemDetails": {                    // Detailed information about problems
    "Topic Name": [                      // Problems grouped by topic
      {
        "name": "string",                // Problem name
        "difficulty": "string",          // Problem difficulty
        "solved": "boolean",             // Whether the problem is solved
        "link": "string",                // Link to the problem
        "solutionPath": "string"         // Path to the solution file
      }
    ]
  },
  "lastUpdated": "string"                // ISO timestamp of last update
}
```

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "error": "Error message describing what went wrong"
}
```

## Rate Limiting

Currently, there are no rate limits implemented for the API.

## Authentication

The API does not currently require authentication.

## Development

To start the server locally:

```bash
cd /DSA/backend
node server.js
```

The server will start on port 3000 by default.