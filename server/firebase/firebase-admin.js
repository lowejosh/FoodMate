const admin = require("firebase-admin");

admin.initializeApp({
  apiKey: "AIzaSyBLRjhM6YncmOcCrSYAPTnABCR1yOvk1E4",
  authDomain: "foodmate-b650f.firebaseapp.com",
  databaseURL: "https://foodmate-b650f.firebaseio.com",
  projectId: "foodmate-b650f",
  storageBucket: "",
  messagingSenderId: "351285917307",
  appId: "1:351285917307:web:ab18d2da035e5da13bd4de",
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  })
});
// apiKey: process.env.FIREBASE_APIKEY,
// authDomain: process.env.FIREBASE_AUTHDOMAIN,
// databaseURL: process.env.FIREBASE_DATABASEURL,
// projectId: process.env.FIREBASE_PROJECTID,
// storageBucket: process.env.FIREBASE_STORAGEBUCKET,
// messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
// appId: process.env.FIREBASE_APPID,

module.exports = admin;
