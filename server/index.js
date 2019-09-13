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
          console.log(userID + " : " + user);
          console.log(data.users[user]);
          if (userID === user) {
            console.log("successful match");
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
        res.json({ verified: true });
      } else {
        res.json({
          verified: false,
          message: "Sorry, you do not have permission to view this room."
        });
      }
    });
});

server.post("/create-room", (req, res) => {
  let data = req.body;
  firebase
    .database()
    .ref("rooms/" + data.roomID)
    .set({
      creatorID: data.creatorID,
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
  res.json({ message: "Room created" });
});
