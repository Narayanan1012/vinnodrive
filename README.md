# VinnoDrive

A simple and secure file storage application that allows users to upload, view, download, and delete files.

![VinnoDrive Screenshot](image.png)

## Features

- 📤 **File Upload** - Upload multiple files at once
- 📋 **File Listing** - View all uploaded files with name, size, and upload date
- 📥 **File Download** - Download files directly to your device
- 🗑️ **File Delete** - Remove files from storage
- 🔒 **SHA-256 Hashing** - Each file is hashed for integrity verification
- 🎨 **Modern UI** - Dark-themed, responsive design

## Tech Stack

### Frontend

- **React** - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Styling with flexbox layout

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (Atlas cloud)
- **Mongoose** - MongoDB ODM
- **Multer** - File upload handling
- **Crypto** - SHA-256 file hashing

### Other

- **express-rate-limit** - API rate limiting
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB Atlas account (or local MongoDB)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/vinnodrive.git
   cd vinnodrive
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   Create a `.env` file in the root directory:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. **Create uploads directory**
   ```bash
   mkdir uploads
   ```

## Running the Application

You need to run both the backend and frontend servers.

### Terminal 1 - Backend Server

```bash
npm run server
```

This starts the Express server on `http://localhost:5000`

### Terminal 2 - Frontend Dev Server

```bash
npm run dev
```

This starts the Vite dev server on `http://localhost:5173`

### Open in Browser

Navigate to `http://localhost:5173`

## Available Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start Vite frontend dev server |
| `npm run server`  | Start Express backend server   |
| `npm run build`   | Build frontend for production  |
| `npm run preview` | Preview production build       |

## API Endpoints

| Method   | Endpoint        | Description            |
| -------- | --------------- | ---------------------- |
| `POST`   | `/upload`       | Upload a file          |
| `GET`    | `/files`        | Get all uploaded files |
| `GET`    | `/download/:id` | Download a file by ID  |
| `DELETE` | `/delete/:id`   | Delete a file by ID    |

## Project Structure

```
vinnodrive/
├── src/
│   ├── frontend/
│   │   ├── basic_Components.jsx   # Main file upload component
│   │   └── basic_Components.css   # Component styles
│   └── main.jsx                   # React entry point
├── uploads/                       # Uploaded files storage
├── server.js                      # Express backend server
├── vite.config.js                 # Vite configuration
├── package.json                   # Dependencies and scripts
├── .env                           # Environment variables (not in git)
└── README.md                      # This file
```

## Configuration

### Vite Proxy

The frontend uses a proxy to communicate with the backend. Configured in `vite.config.js`:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

### File Upload Limits

- Maximum file size: **10MB**
- Rate limit: **100 requests per 15 minutes**

## Troubleshooting

### Port already in use

```bash
# Windows - Kill process on port
taskkill /F /IM node.exe

# Or change port in .env file
PORT=5001
```

### MongoDB connection error

- Verify your connection string in `.env`
- Ensure special characters in password are URL-encoded (e.g., `@` → `%40`)
- Check MongoDB Atlas IP whitelist settings

### CORS errors

Make sure the backend server is running before the frontend.

## License

MIT License - feel free to use this project for learning or personal use.

## Author

Built with ❤️ by VinnoDrive Team
