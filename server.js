const express = require("express");
const app = express();
const studentRoutes = require("./routes/students");
const testRoutes = require("./routes/tests");

require("dotenv").config();
app.use(express.json());
app.use("/api/students", studentRoutes);
app.use("/api/tests", testRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
