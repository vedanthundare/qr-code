import express from 'express';
import qr from 'qr-image';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/generate', (req, res) => {
    const url = req.body.url;
    if (url) {
        try {
            const qr_svg = qr.image(url, { type: 'png' });

            // Set the Content-Type header to image/png and send the QR code image
            res.setHeader('Content-Type', 'image/png');
            qr_svg.pipe(res);  // Send the image directly as a response
        } catch (error) {
            res.json({ success: false, message: 'Failed to generate QR code.' });
        }
    } else {
        res.json({ success: false, message: 'URL is required' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
