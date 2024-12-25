const express = require('express');
const cors = require('cors');
const request = require('request');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/proxy', (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('URL is required');
    }
    request(url).pipe(res);
});

app.listen(port, () => {
    console.log(`CORS proxy server running on port ${port}`);
});
