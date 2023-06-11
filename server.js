const express = require('express');
const fileUpload = require('express-fileupload');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');



// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://resumes-5a0fb.appspot.com'
});

const storage = admin.storage();
const bucket = storage.bucket('resumes');

const app = express();

// Middleware for file upload
app.use(fileUpload());

// Upload endpoint
app.post('/upload', (req, res) => {
  if (!req.files || !req.files.fileToUpload) {
    return res.status(400).send('No file uploaded.');
  }

  const uploadedFile = req.files.fileToUpload;

  // Upload the file to Firebase Storage
  const file = bucket.file('file-name.txt');

  file.createWriteStream()
    .on('error', (err) => {
      console.error('Error uploading file:', err);
      res.status(500).send('File upload failed.');
    })
    .on('finish', () => {
      console.log('File uploaded successfully.');
      res.send('File uploaded and processed successfully.');
    })
    .end(uploadedFile.data);
});

// Start the server
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
