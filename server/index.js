const dotenv = require("dotenv").config();
const express = require("express");
const zomato = require("zomato");
const cors = require("cors");
const server = express();
const PORT = process.env.PORT || 8000;
const client = zomato.createClient({
  userKey: process.env.ZOMATO_API_KEY
});

// setup
server.use(cors());
server.listen(PORT, () => {
  console.log(`Server Running on port: ${PORT}`);
});

// endpoints
server.get("/all-cuisines/:lat/:lng", (req, res) => {
  const lat = req.params.lat;
  const lng = req.params.lng;
  client.getCuisines(
    {
      lat: lat,
      lon: lng
    },
    (err, result) => {
      if (!err) {
        res.json(result);
      } else {
        res.json({ message: `No data exists for given location` });
        console.log(err);
      }
    }
  );
});

// get list of top cuisines from location info
server.get("/top-cuisines/:lat/:lng", (req, res) => {
  const lat = req.params.lat;
  const lng = req.params.lng;
  client.getGeocode(
    {
      lat: lat,
      lon: lng
    },
    (err, result) => {
      if (!err) {
        result = JSON.parse(result);
        res.send(result.popularity.top_cuisines);
        //res.json(result);
      } else {
        res.json({ message: `No data exists for given location` });
        console.log(err);
      }
    }
  );
});
