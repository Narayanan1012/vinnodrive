# VinnoDrive - Simple File Upload Backend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running on your local machine

3. Start the server:
```bash
npm start
```

## API Endpoints

### Upload File
- **POST** `/upload`
- Form-data with key `file`

### List Files
- **GET** `/files`

### Download File
- **GET** `/download/:id`

### Delete File
- **DELETE** `/delete/:id`

## Example using curl

Upload:
```bash
curl -F "file=@yourfile.pdf" http://localhost:3000/upload
```

List files:
```bash
curl http://localhost:3000/files
```

Download:
```bash
curl http://localhost:3000/download/FILE_ID --output downloaded.pdf
```
