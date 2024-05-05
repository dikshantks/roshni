const admin = require("firebase-admin");
require("dotenv").config();

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

        const snapshot = await db.collection("result").get();
        console.log("Firestore initialized");
    } catch (error) {
        console.log("Error fetching data: ", error);
    }
};

fetchData();
const auth = admin.auth();

module.exports = { admin, db, auth };
