import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Resume from '../models/Resume.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Keep original file extension but use a timestamp for uniqueness
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Allow only PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload new resume
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Delete previous resume file if it exists
    const previousResume = await Resume.findOne();
    if (previousResume) {
      const previousPath = previousResume.path;
      if (fs.existsSync(previousPath)) {
        fs.unlinkSync(previousPath);
      }
      await Resume.deleteOne({ _id: previousResume._id });
    }

    // Save new resume info to database
    const resume = new Resume({
      filename: req.file.originalname,
      path: req.file.path
    });
    await resume.save();

    res.json({
      message: 'Resume uploaded successfully',
      resume: {
        filename: resume.filename,
        uploadedAt: resume.uploadedAt
      }
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ error: 'Error uploading resume' });
  }
});

// Get current resume info
router.get('/current', async (req, res) => {
  try {
    const resume = await Resume.findOne();
    if (!resume) {
      return res.status(404).json({ error: 'No resume found' });
    }
    res.json({
      filename: resume.filename,
      uploadedAt: resume.uploadedAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching resume info' });
  }
});

// Download resume
router.get('/download', async (req, res) => {
  try {
    const resume = await Resume.findOne();
    if (!resume || !fs.existsSync(resume.path)) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.download(resume.path, resume.filename);
  } catch (error) {
    res.status(500).json({ error: 'Error downloading resume' });
  }
});

// Delete current resume
router.delete('/current', async (req, res) => {
  try {
    const resume = await Resume.findOne();
    if (!resume) {
      return res.status(404).json({ error: 'No resume found' });
    }

    // Delete file from storage
    if (fs.existsSync(resume.path)) {
      fs.unlinkSync(resume.path);
    }

    // Delete from database
    await Resume.deleteOne({ _id: resume._id });

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting resume' });
  }
});

export default router;
