const dotenv = require("dotenv").config();
const axios = require("axios");
const express = require("express");
const zomato = require("zomato");
const cors = require("cors");
const server = express();
const PORT = process.env.PORT || 8000;
const client = zomato.createClient({
  userKey: process.env.ZOMATO_API_KEY
});
const firebase = require("./firebase/firebase-admin");

// setup
server.use(cors());
server.use(express.urlencoded());
server.use(express.json());
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

server.get("/location-name/:roomID", (req, res) => {
  const roomID = req.params.roomID;
  firebase
    .database()
    .ref("rooms/" + roomID)
    .once("value")
    .then(function(snapshot) {
      res.json({
        locationDescription: snapshot.val().locationDescription,
        roomName: snapshot.val().roomName,
        lat: snapshot.val().lat,
        lng: snapshot.val().lng
      });
    });
});

server.get("/restaurants/:roomID", (req, res) => {
  const roomID = req.params.roomID;
  let lat;
  let lng;

  const fetchRestaurants = async (lat, lng, radius) => {
    // does 2 calls because zomato limits to 20 results -- need 40
    const config = { headers: { "user-key": process.env.ZOMATO_API_KEY } };
    const URL = `https://developers.zomato.com/api/v2.1/search?lat=${lat}&lon=${lng}&start=0&count=20&radius=${radius}&sort=real_distance`;
    const URL2 = `https://developers.zomato.com/api/v2.1/search?lat=${lat}&lon=${lng}&start=20&count=20&radius=${radius}$sort=real_distance`;
    await axios.get(URL, config).then(async data => {
      await axios.get(URL2, config).then(data2 => {
        // create the payload
        let restaurants = data.data.restaurants.concat(data2.data.restaurants);
        let payload = [];
        restaurants.forEach(i => {
          let el = i.restaurant;
          payload.push({
            id: el.id,
            name: el.name,
            cuisines: el.cuisines.split(", "),
            establishment: el.establishment,
            lat: el.location.latitude,
            lng: el.location.longitude,
            address: el.location.address,
            rating: el.user_rating.aggregate_rating,
            ratingCount: el.user_rating.votes,
            url: el.url
          });
        });

        res.json({ payload: payload, lat: lat, lng: lng, radius: radius });
      });
    });
  };

  // get lat and lng
  firebase
    .database()
    .ref("rooms/" + roomID)
    .once("value")
    .then(snapshot => {
      lat = snapshot.val().lat;
      lng = snapshot.val().lng;
      radius = snapshot.val().radius * 1000;

      // get zomato stuff from axios because client.search isn't working...
      fetchRestaurants(lat, lng, radius);
    });
});

server.get("/invite-id/:inviteID", (req, res) => {
  const inviteID = req.params.inviteID;
  firebase
    .database()
    .ref("rooms/")
    .once("value")
    .then(function(snapshot) {
      let failed = true;
      snapshot.val().forEach(child => {
        if (inviteID === child.inviteID) {
          failed = false;
          res.send(child.key);
        }
      });
      if (failed) {
        res.send(null);
      }
    });
});

// server.get("/load-room/:roomID", (req, res) => {
//   const roomID = req.params.roomID;
//   firebase
//     .database()
//     .ref("rooms/" + roomID)
//     .once("value")
//     .then(function(snapshot) {
//       res.json(snapshot.val());
//     });
// });

server.get("/verify-room/:roomID/:userID", (req, res) => {
  const roomID = req.params.roomID;
  const userID = req.params.userID;
  firebase
    .database()
    .ref("rooms/" + roomID)
    .once("value")
    .then(function(snapshot) {
      // check if theres a match for the user in the room
      let data = snapshot.val();
      let verified = false;
      if (data) {
        for (user in data.users) {
          if (userID === user) {
            verified = true;
          }
        }
      } else {
        res.json({
          verified: false,
          message: "Sorry, this room does not exist."
        });
        return;
      }

      // response
      if (verified) {
        res.json({
          verified: true,
          inviteID: data.inviteID,
          roomName: data.roomName
        });
      } else {
        res.json({
          verified: false,
          message: "Sorry, you do not have permission to view this room."
        });
      }
    });
});

// returns the room list for a given user
server.get("/list-data/:userID", (req, res) => {
  const userID = req.params.userID;
  firebase
    .database()
    .ref("users/" + userID)
    .once("value")
    .then(function(snapshot) {
      let data = snapshot.val();
      if (data) {
        res.json(data.rooms);
      } else {
        res.json(null);
      }
    });
});

// returns the room list for a given user
server.get("/room-cuisines/:roomID", (req, res) => {
  const roomID = req.params.roomID;
  firebase
    .database()
    .ref(`rooms/${roomID}/users`)
    .once("value")
    .then(function(snapshot) {
      let data = snapshot.val();
      if (data) {
        let cuisineArray = [];
        Object.keys(data).forEach(user => {
          cuisineArray.push({
            user: data[user].nickName,
            cuisine: data[user].cuisines
          });
        });
        res.json(cuisineArray);
      } else {
        res.json(null);
      }
    });
});

// creates the room
server.post("/create-room", (req, res) => {
  let data = req.body;
  // set the room data
  firebase
    .database()
    .ref("rooms/" + data.roomID)
    .set({
      creatorID: data.creatorID,
      roomName: data.roomName,
      inviteID: data.inviteID,
      lat: data.lat,
      lng: data.lng,
      locationDescription: data.locationDescription,
      radius: data.radius,
      users: {
        [data.users[0].id]: {
          nickName: data.users[0].nickName,
          cuisines: data.users[0].cuisines
        }
      }
    });

  // set the user data
  firebase
    .database()
    .ref(`users/${data.creatorID}/rooms/${data.roomID}`)
    .set(data.roomName);

  res.json({ message: "Room created" });
});

// joins the room
server.post("/join-room", (req, res) => {
  let data = req.body;
  // get room data
  let roomID;
  let roomName;
  firebase
    .database()
    .ref("rooms/")
    .once("value")
    .then(snapshot => {
      let success = false;
      snapshot.forEach(child => {
        if (child.val().inviteID === data.inviteID) {
          success = true;
          roomID = child.key;
          roomName = child.val().roomName;
        }
      });

      if (!success) {
        res.json({ failed: true });
      } else {
        // set the room user data
        firebase
          .database()
          .ref(`rooms/${roomID}/users/${data.userID}`)
          .set({
            nickName: data.nickName,
            cuisines: data.cuisines
          });

        // set the user room data
        firebase
          .database()
          .ref(`users/${data.userID}/rooms/${roomID}`)
          .set(roomName);
        res.json({ roomID: roomID });
      }
    });
});

// suggests a location
server.post("/suggest-location", (req, res) => {
  let data = req.body;

  let payload = {
    name: data.name,
    cuisines: data.cuisines,
    establishment: data.establishment
  };

  // set suggested location data
  firebase
    .database()
    .ref(`rooms/${data.roomID}/suggestedLocations/${data.id}`)
    .set(payload);
  res.json({ message: "Added location" });
});

// get suggested locations
server.get("/get-suggested-locations/:roomID", (req, res) => {
  const roomID = req.params.roomID;
  firebase
    .database()
    .ref(`rooms/${roomID}/suggestedLocations`)
    .once("value")
    .then(function(snapshot) {
      if (snapshot) {
        res.json(snapshot.val());
      } else {
        res.send(null);
      }
    });
});
