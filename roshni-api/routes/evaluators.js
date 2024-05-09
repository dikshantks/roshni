const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase"); // Import Firestore instance
const admin = require("firebase-admin"); // For Firestore Security Rules (optional)
const crypto = require("crypto"); // Secure random number generation
const bcrypt = require("bcrypt"); // Password hashing

router.get("/", async (req, res) => {
    try {
        const evaluators = await db.collection("evaluators").get();
        console.log(evaluators.docs);
        const evaluatorData = evaluators.docs.map((doc) => doc.data());
        res.json(evaluatorData);
    } catch (error) {
        console.error("error at GET /evaluator", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Signup endpoint
router.post("/signup", async (req, res) => {
    try {
        const { adminId, firstname, lastname, email, password, DOB, loc } =
            req.body;

        // Validate user input
        if (!adminId || !firstname || !lastname || !email || !DOB || !loc) {
            return res.status(404).json({
                error: "Missing required fields",
            });
        }
        const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dobRegex.test(DOB)) {
            return res.status(401).json({
                error: "Invalid DOB format. Please use DD-MM-YYYY.",
            });
        }

        async function generateUniquePin() {
            let evalID;
            let pinExists = true;
            // Keep generating PINs until a unique one is found
            while (pinExists) {
                evalID = crypto
                    .randomInt(1000, 9999)
                    .toString()
                    .padStart(4, "0");
                const evaluatorDoc = await db
                    .collection("evaluators")
                    .doc(evalID)
                    .get();
                pinExists = evaluatorDoc.exists;
            }
            return evalID;
        }
        const evalID = await generateUniquePin();

        // Hash the PIN securely (consider storing only the hash for additional security)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a student document in Firestore with generated PIN
        const evaluatorRef = await db.collection("evaluators").doc(evalID).set({
            firstname,
            lastname,
            email,
            DOB,
            loc,
            evalID: evalID,
            password: hashedPassword, // Store only the hashed PIN
            adminId,
        });

        // Customize response JSON according to requirements
        const response = {
            message: "Evaluator registered successfully",
            firstname,
            lastname,
            email,
            DOB,
            loc,
            evalID: evalID,
            password: password,
            adminId: adminId,
        };

        // Optionally, return only relevant details or omit certain fields

        res.json(response);
    } catch (error) {
        console.error("error at signup:", error);
        // Handle specific errors (e.g., duplicate document ID)
        // and provide informative error messages to the user
        res.status(500).json({ error: "Failed to register evaluator" });
    }
});

// Login endpoint
router.post("/login", async (req, res) => {
    try {
        const { evalID, password } = req.body;

        if (!evalID || !password) {
            return res.status(400).json({ error: "Missing ID or password" });
        }

        const evaluatorDoc = await db
            .collection("evaluators")
            .doc(evalID)
            .get();

        if (!evaluatorDoc.exists) {
            return res.status(401).json({ error: "Invalid ID or password" });
        }

        const evaluatorData = evaluatorDoc.data();
        const hashedPassword = evaluatorData.password;

        // Compare the provided password with the hashed password from the database
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid ID or password" });
        }

        // If password is correct, delete the hashed password from the response
        delete evaluatorData.password;

        res.json({
            message: "Login successful",
            evaluatorData,
        });
    } catch (error) {
        console.error("error at login:", error);
        // Handle errors and provide informative messages
        res.status(500).json({ error: "Login failed", message: error.message });
    }
});

//Delete evaluator
router.delete("/delete/:evalID", async (req, res) => {
    try {
        const { evalID } = req.params;
        if (!evalID) {
            return res.status(400).json({ error: "Missing ID" });
        }
        const evaluatorDoc = await db
            .collection("evaluators")
            .doc(evalID)
            .get();
        if (!evaluatorDoc.exists) {
            return res.status(404).json({ error: "Evaluator not found" });
        } else {
            await db.collection("evaluators").doc(evalID).delete();
            res.json({ message: "Evaluator deleted successfully" });
        }
    } catch (error) {
        console.error("error at delete:", error);
        res.status(500).json({ error: "Failed to delete evaluator" });
    }
});

// Change password endpoint
router.post("/changepassword", async (req, res) => {
    try {
        const { evalID, oldPassword, newPassword } = req.body;

        if (!evalID || !oldPassword || !newPassword) {
            return res
                .status(400)
                .json({ error: "Missing ID, old password, or new password" });
        }

        const evaluatorDoc = await db
            .collection("evaluators")
            .doc(evalID)
            .get();

        if (!evaluatorDoc.exists) {
            return res.status(404).json({ error: "Evaluator not found" });
        }

        const evaluatorData = evaluatorDoc.data();
        const hashedPassword = evaluatorData.password;

        // Compare the provided old password with the hashed password from the database
        const passwordMatch = await bcrypt.compare(oldPassword, hashedPassword);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid old password" });
        }

        // Hash the new password securely
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        await db.collection("evaluators").doc(evalID).update({
            password: newHashedPassword,
        });

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("error at changepassword:", error);
        res.status(500).json({ error: "Failed to change password" });
    }
});

// Update evaluator
router.put("/update/:evalID", async (req, res) => {
    try {
        const { evalID } = req.params;
        const { firstname, lastname, email, DOB, loc } = req.body;

        // Check if evalID is provided
        if (!evalID) {
            return res.status(400).json({ error: "Missing evaluator ID" });
        }

        // Check if at least one field to update is provided
        if (!firstname && !lastname && !email && !DOB && !loc) {
            return res.status(400).json({ error: "No fields to update" });
        }

        const evaluatorRef = db.collection("evaluators").doc(evalID);

        // Check if the evaluator exists
        const evaluatorDoc = await evaluatorRef.get();
        if (!evaluatorDoc.exists) {
            return res.status(404).json({ error: "Evaluator not found" });
        }

        // Prepare the update data
        const updateData = {};
        if (firstname) updateData.firstname = firstname;
        if (lastname) updateData.lastname = lastname;
        if (email) updateData.email = email;
        if (DOB) updateData.DOB = DOB;
        if (loc) updateData.loc = loc;

        // Perform the update
        await evaluatorRef.update(updateData);

        res.send({ message: "Evaluator updated successfully" });
    } catch (error) {
        console.error("Error at update:", error);
        res.status(500).json({ error: "Failed to update evaluator" });
    }
});

module.exports = router;
