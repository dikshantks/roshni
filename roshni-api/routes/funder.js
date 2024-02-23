const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase"); // Import Firestore instance
const admin = require("firebase-admin"); // For Firestore Security Rules (optional)
const crypto = require("crypto"); // Secure random number generation
const bcrypt = require("bcrypt"); // Password hashing

router.get("/", async (req, res) => {
    try {
        const funders = await db.collection("funders").get();
        console.log(funders.docs);
        const fundData = funders.docs.map((doc) => doc.data());
        res.json(fundData);
    } catch (error) {
        console.error("error at GET /fund", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Login endpoint
router.post("/login", async (req, res) => {
    try {
        const { fundID, password } = req.body;

        if (!fundID || !password) {
            return res.status(400).json({ error: "Missing ID or password" });
        }

        const fundDoc = await db.collection("funders").doc(fundID).get();

        if (!fundDoc.exists) {
            return res.status(401).json({ error: "Invalid ID or password" });
        }

        const fundData = fundDoc.data();
        const hashedPassword = fundData.password;

        // Compare the provided password with the hashed password from the database
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid ID or password" });
        }

        // If password is correct, delete the hashed password from the response
        delete fundData.password;

        res.json({
            message: "Login successful",
            fundData,
        });
    } catch (error) {
        console.error("error at login:", error);
        // Handle errors and provide informative messages
        res.status(500).json({ error: "Login failed", message: error.message });
    }
});

module.exports = router;