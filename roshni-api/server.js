const express = require("express");
const app = express();
const studentRoutes = require("./routes/students");
const evaluatorsRoutes = require("./routes/evaluators");
const adminRoutes = require("./routes/admin");
const testRoutes = require("./routes/tests");
const fundRoutes = require("./routes/funder");
const resultRoutes = require("./routes/results");
require("dotenv").config();

const cors = require("cors");

const prodorigins = [];
const devorigin = ["http://localhost:5173"];
const allowedorigin =
    process.env.NODE_ENV === "production" ? prodorigins : devorigin;
const corsOptions = {
    // origin: "http://localhost:5173",

    origin: (origin, callback) => {
        if (allowedorigin.includes(origin)) {
            console.log(origin, allowedorigin);
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, //access-control-allow-credentials:true
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/students", studentRoutes);
app.use("/api/evaluators", evaluatorsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/funder", fundRoutes);
app.use("/api/results", resultRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
