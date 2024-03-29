const express = require("express");
const app = express();
const studentRoutes = require("./routes/students");
const evaluatorsRoutes = require("./routes/evaluators");
const adminRoutes = require("./routes/admin");
const testRoutes = require("./routes/tests");
const fundRoutes = require("./routes/funder");

require("dotenv").config();
app.use(express.json());
app.use("/api/students", studentRoutes);
app.use("/api/evaluators", evaluatorsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/funder", fundRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
