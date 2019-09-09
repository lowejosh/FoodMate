const dotenv = require('dotenv').config();
const express = require('express');
const server = express();
const PORT = process.env.PORT || 8000;
const admin = require('./firebase-admin/admin');

server.listen(PORT, () => {
  console.log(`Server Running on port: ${PORT}`);
});

const verifyToken = async (req, res, next) => {
    const idToken = req.headers.authorization;

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        if (decodedToken) {
            req.body.uid = decodedToken.uid; 

            return next();
        } else {
            return res.status(401).send('You are not authorized');
        }
    } catch (e) {
        return res.status(401).send('You are not authorized');
    }
}

server.use('/', verifyToken);

server.get('test', async (req, res) => {
    const { uid } = req.body;


});
