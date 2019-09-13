const dotenv = require("dotenv").config();
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
        res.json({ verified: true, inviteID: data.inviteID });
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
      users: {
        [data.users[0].id]: {
          nickName: data.users[0].nickName,
          lat: data.users[0].lat,
          lng: data.users[0].lng,
          locationDescription: data.users[0].locationDescription,
          radius: data.users[0].radius,
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

// creates the room
server.post("/join-room", (req, res) => {
  let data = req.body;
  // set the room user data
  firebase
    .database()
    .ref(`rooms/${data.roomID}/users/${userID}`)
    .set({
      nickName: data.nickName,
      lat: data.lat,
      lng: data.lng,
      locationDescription: data.locationDescription,
      radius: data.radius,
      cuisines: data.cuisines
    });

  // set the user room data
  firebase
    .database()
    .ref(`users/${data.userID}/rooms/${data.roomID}`)
    .set(data.roomName);
  res.json({ message: "Room created" });
});
