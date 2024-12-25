const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.get('/geojson', async (req, res) => {
    const url = req.query.url;
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching GeoJSON file.');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
