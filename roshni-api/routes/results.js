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
        const { testID, testScores } = req.body;  

        // Validate all required fields
        if (!testID || !testScores) {
            return res.status(400).json({
                error: "Missing required fields."
            });
        }

        // Check if all student IDs exist in the students collection
        const studentIDs = Object.keys(testScores);
        const studentsQuery = await db.collection("students").where("pin", "in", studentIDs).get();
        const existingStudents = studentsQuery.docs.map(doc => doc.data().pin);

        const missingStudents = studentIDs.filter(id => !existingStudents.includes(id));
        if (missingStudents.length > 0) {
            return res.status(404).json({ error: `Students with IDs ${missingStudents.join(', ')} not found` });
        }


        const testRef = await db.collection("tests").doc(testID).get();
        if (!testRef.exists) {
            return res.status(404).json({ error: "Test not found" });
        }
        
        const testName = testRef.data().subject;
        
        // Create a test result document in Firestore
        const resultRef = await db.collection("results").doc(testID).set({
            resultID: testID,
            testScores,
            testID: testID,
            testName: testName
        });
    
        res.json({ message: "Test result added successfully" });
    } 
        catch (error) {
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


//PUT endpoint to update a test result
router.put("/update/:resultID", async (req, res) => {
    try {
        const { resultID } = req.params;
        const { testScores={}, testID } = req.body;

        // Check if all student IDs exist in the students collection
        const studentIDs = Object.keys(testScores);
        const studentsQuery = await db.collection("students").where("pin", "in", studentIDs).get();
        const existingStudents = studentsQuery.docs.map(doc => doc.data().pin);

        const missingStudents = studentIDs.filter(id => !existingStudents.includes(id));
        if (missingStudents.length > 0) {
            return res.status(404).json({ error: `Students with PINs ${missingStudents.join(', ')} not found` });
        }
   
        const resultDoc = await db.collection("results").doc(resultID).get();
        if (!resultDoc.exists) {
            return res.status(404).json({ error: "Test result not found" });
        }

        // Get existing test scores
        const existingTestScores = resultDoc.data().testScores;

        // Merge existing test scores with new scores (if any)
        const updatedTestScores = { ...existingTestScores, ...testScores };

        // Prepare updated fields
        const updateFields = {};
        updateFields.testScores = updatedTestScores;

        // If testID is provided, update the resultID, testID, and testName
        if (testID) {
            const testRef = await db.collection("tests").doc(testID).get();
            if (!testRef.exists) {
                return res.status(404).json({ error: "Test not found" });
            }
            const testName = testRef.data().subject;

            // Update the fields with new metadata
            updateFields.resultID = testID;
            updateFields.testID = testID;
            updateFields.testName = testName;
        
             // Create a new document with updated metadata and data
            const newDocRef = db.collection("results").doc(testID);
            await newDocRef.set(updateFields);
        
         // Delete the old document if needed
         if (testID !== resultID) {
             await db.collection("results").doc(resultID).delete();
         }
        }
        else {
            // Update the test scores only
            await db.collection("results").doc(resultID).update(updateFields);
        }
        res.json({ message: "Test result updated successfully" });
    } catch (error) {
        console.error("Error updating test result:", error);
        res.status(500).json({ error: "Failed to update test result" });
    }
});


module.exports = router;
