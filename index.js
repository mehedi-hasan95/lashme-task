const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient, ServerApiVersion } = require("mongodb");

require("dotenv").config();
const port = 5000;

// MiddleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.k4gmzpi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        const userCollectoin = client.db("Lashme").collection("users");

        // Create a user
        app.post("/users", async (req, res) => {
            const { username, email, password } = req.body;
            try {
                const saltRounds = await bcrypt.genSalt(10);
                const hashPass = await bcrypt.hash(
                    req.body.password,
                    saltRounds
                );
                const newUser = {
                    username,
                    email,
                    password: hashPass,
                };
                const result = await userCollectoin.insertOne(newUser);
                res.status(201).json({ message: "User created successfully" });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        // Get a user
        app.get("/users/:username", async (req, res) => {
            try {
                const username = req.params.username;
                const query = { username };
                const user = await userCollectoin.findOne(query);

                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                res.status(200).json(user);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    } finally {
    }
}
run().catch(console.log);

app.get("/", (req, res) => {
    res.send("Lashme Innovations Private Limited");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
