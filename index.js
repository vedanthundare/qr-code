import express from 'express';
import qr from 'qr-image';
import fs from 'fs';
import bodyParser from 'body-parser';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique filenames

const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' directory

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/generate', (req, res) => {
    const url = req.body.url;
    if (url) {
        const uniqueFilename = `${uuidv4()}.png`; // Generate a unique filename
        const qrPath = path.join('public', uniqueFilename);
        const qr_svg = qr.image(url, { type: 'png' });
        qr_svg.pipe(fs.createWriteStream(qrPath));

        qr_svg.on('end', () => {
            res.json({ success: true, qrPath: `/${uniqueFilename}` });
        });
    } else {
        res.json({ success: false, message: 'URL is required' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
