const express = require('express');
const request = require('request');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.get('/proxy', (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('URL is required');
    }

    request(url).pipe(res);
});

app.listen(port, () => {
    console.log(`Proxy server is running on http://localhost:${port}`);
});
