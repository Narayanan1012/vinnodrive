const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// File Schema
const fileSchema = new mongoose.Schema({
  originalName: String,
  fileName: String,
  fileHash: String,
  size: Number,
  mimeType: String,
  uploadDate: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(express.json());

// Upload file
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Calculate file hash
    const fileBuffer = fs.readFileSync(req.file.path);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Save file info to database
    const fileDoc = new File({
      originalName: req.file.originalname,
      fileName: req.file.filename,
      fileHash: hash,
      size: req.file.size,
      mimeType: req.file.mimetype
    });

    await fileDoc.save();

    res.json({
      message: 'File uploaded successfully',
      fileId: fileDoc._id,
      hash: hash
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download file
app.get('/download/:id', async (req, res) => {
  try {
    const fileDoc = await File.findById(req.params.id);
    
    if (!fileDoc) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = path.join(uploadsDir, fileDoc.fileName);
    res.download(filePath, fileDoc.originalName);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List all files
app.get('/files', async (req, res) => {
  try {
    console.log('Fetching files...');
    const files = await File.find().select('-__v');
    console.log('Files found:', files);
    res.json(files);
  } catch (error) {
    console.error('Error in /files:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete file
app.delete('/delete/:id', async (req, res) => {
  try {
    const fileDoc = await File.findById(req.params.id);
    
    if (!fileDoc) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = path.join(uploadsDir, fileDoc.fileName);
    fs.unlinkSync(filePath);
    await File.findByIdAndDelete(req.params.id);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
