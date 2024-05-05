// Import necessary functions
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const admin = require("firebase-admin");
require("dotenv").config();

// const firebaseConfig = {
//     apiKey: process.env.FIREBASE_API_KEY,
//     authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.FIREBASE_APP_ID,
//     measurementId: process.env.FIREBASE_MEASUREMENT_ID,
// };
// // Initialize Firebase app
// const app = initializeApp(firebaseConfig);
// console.log(firebaseConfig);
// const serviceAccount = require("../key.json");

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

console.log(serviceAccount);

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        logging: true,
    });
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Error initializing Firebase:", error);
}

const db = admin.firestore();

const fetchData = async () => {
    try {
        console.log("Firestore start ");

        const snapshot = await db.collection("development-1").get();
        console.log("Firestore initialized");
    } catch (error) {
        console.log("Error fetching data: ", error);
    }
};

fetchData();
const auth = admin.auth();

module.exports = { admin, db, auth };
