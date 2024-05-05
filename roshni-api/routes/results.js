const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase"); // Import Firestore instance
const crypto = require("crypto"); // Secure random number generation

// GET endpoint to retrieve all test results
router.get("/", async (req, res) => {
    try {
        const results = await db.collection("results").get();
        const resultsData = results.docs.map((doc) => doc.data());
        res.json(resultsData);
    } catch (error) {
        console.error("Error at GET /results", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST endpoint to add a new test result
router.post("/add", async (req, res) => {
    try {
        // Destructure required fields from request body
        const { studentID, testScores } = req.body;  

        async function generateUniquePin() {
            let resultID;
            let pinExists = true;
            // Keep generating PINs until a unique one is found
            while (pinExists) {
                resultID = crypto.randomInt(1000, 9999).toString().padStart(4, "0");
                const resultDoc = await db.collection("results").doc(resultID).get();
                pinExists = resultDoc.exists;
            }
            return resultID;
          }
        const resultID = await generateUniquePin();
        // Validate all required fields
        if (!studentID || !testScores) {
            return res.status(400).json({
                error: "Missing required fields: studentID, testScores."
            });
        }

        // Create a test result document in Firestore
        const resultRef = await db.collection("results").doc(resultID).set({
            studentID,
            testScores,
            resultID: resultID
        });

        res.json({ message: "Test result added successfully" });
    } catch (error) {
        console.error("Error adding test result:", error);
        res.status(500).json({ error: "Failed to add test result" });
    }
});

// DELETE endpoint to delete a test result
router.delete("/delete/:resultID", async (req, res) => {
    try {
        const { resultID } = req.params;

        // Ensure resultID is provided
        if (!resultID) {
            return res.status(400).json({
                error: "Missing test result ID in request path."
            });
        }

        const resultDoc = await db.collection("results").doc(resultID).get();
        if (!resultDoc.exists) {
            return res.status(404).json({ error: "Test result not found" });
        }

        await db.collection("results").doc(resultID).delete();
        res.json({ message: "Test result deleted successfully" });
    } catch (error) {
        console.error("Error deleting test result:", error);
        res.status(500).json({ error: "Failed to delete test result" });
    }
});

// PUT endpoint to update a test result
router.put("/update/:resultID", async (req, res) => {
    try {
        const { resultID } = req.params;
        const { testScores, studentID } = req.body;

        const resultDoc = await db.collection("results").doc(resultID).get();
        if (!resultDoc.exists) {
            return res.status(404).json({ error: "Test result not found" });
        }

        // Get existing test scores
        let existingTestScores = resultDoc.data().testScores || {};

        // Merge new test scores with existing scores
        const updatedTestScores = { ...existingTestScores, ...testScores };

        // Update fields
        await db.collection("results").doc(resultID).update({
            testScores: updatedTestScores,
            studentID: studentID !== undefined ? studentID : resultDoc.data().studentID // Keep existing studentID if not provided
        });

        res.json({ message: "Test result updated successfully" });
    } catch (error) {
        console.error("Error updating test result:", error);
        res.status(500).json({ error: "Failed to update test result" });
    }
});

module.exports = router;
