const express = require('express');
const AWS = require('aws-sdk');
require('dotenv').config();
const authenticateToken = require('./auth');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

const s3 = new AWS.S3({
  endpoint: process.env.MINIO_URL, 
  accessKeyId: process.env.MINIO_ACCESS_KEY, 
  secretAccessKey: process.env.MINIO_SECRET_KEY, 
  s3ForcePathStyle: true, 
});

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('File Manager API is running!');
});

app.get('/secure-data', authenticateToken, (req, res) => {
  res.send(`Hello, ${req.user.preferred_username}. You have access!`);
});


app.get('/test', (req, res) => {
  res.send('This is a simple test route!');
});


app.post('/upload', authenticateToken, (req, res) => {
  const { filename, content } = req.body;

  if (!filename || !content) {
    return res.status(400).send('Filename and content are required');
  }

  const params = {
    Bucket: 'my-bucket', 
    Key: filename, 
    Body: Buffer.from(content),
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).send('Error uploading file');
    }
    res.send(`File uploaded successfully: ${data.Location}`);
  });
});

app.get('/download/:filename', authenticateToken, (req, res) => {
  const params = {
    Bucket: 'my-bucket', 
    Key: req.params.filename, 
  };

  s3.getObject(params, (err, data) => {
    if (err) {
      console.error('Error downloading file:', err);
      return res.status(500).send('Error downloading file');
    }
    res.send(data.Body); 
  });
});

app.put('/update/:filename', authenticateToken, (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).send('Content is required');
  }

  const params = {
    Bucket: 'my-bucket', 
    Key: req.params.filename, 
    Body: Buffer.from(content),
  };

  s3.putObject(params, (err, data) => {
    if (err) {
      console.error('Error updating file:', err);
      return res.status(500).send('Error updating file');
    }
    res.send(`File updated successfully: ${data}`);
  });
});

app.delete('/delete/:filename', authenticateToken, (req, res) => {
  const params = {
    Bucket: 'my-bucket', 
    Key: req.params.filename, 
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.error('Error deleting file:', err);
      return res.status(500).send('Error deleting file');
    }
    res.send('File deleted successfully');
  });
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
