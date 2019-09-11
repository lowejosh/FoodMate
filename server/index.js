const dotenv = require('dotenv').config();
const express = require('express');
const zomato = require('zomato');
const server = express();
const PORT = process.env.PORT || 8000;
const client = zomato.createClient({
    userKey: process.env.ZOMATO_API_KEY
});

server.listen(PORT, () => {
    console.log(`Server Running on port: ${PORT}`);
});

server.get("/cuisines/:lat/:lng", (req, res) => {
    const lat = req.params.lat;
    const lng = req.params.lng;
    client.getCuisines({
        lat: lat,
        lon: lng,
    }, (err, result) => {
        if (!err) {
            res.json(result);
        } else {
            res.json({ message: `City at given location doesn't exist` })
            console.log(err);
        }
    });
});