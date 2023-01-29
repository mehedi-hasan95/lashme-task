const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();

// Import from Model
const authRoute = require("./api/routes/User");

const port = process.env.PORT || 5000;

// MiddleWare
app.use(cors());
app.use(express.json());

// Connect MongoDB with Mongoose

mongoose
    .connect(process.env.DB_URL)
    .then(console.log("Connected to the Lashme server"))
    .catch((err) => console.log(err));

// Make API
app.use("/api", authRoute);

app.get("/", (req, res) => {
    res.send("Lashme Innovations Private Limited");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
