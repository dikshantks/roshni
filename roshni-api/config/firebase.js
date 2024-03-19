// Import necessary functions
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const admin = require("firebase-admin");
require("dotenv").config();
// const serviceAccount = require("../key.json");
// const serviceAccount = s1.replace(/"/g, '\\"').replace(/\n/g, "\\n");
// const serviceAccount = JSON.stringify(JSON.parse(s1));

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
        // console.error(error);
    }
};

fetchData();
const auth = admin.auth();

// Export Firestore instance for use in other files
module.exports = { admin, db, auth };
