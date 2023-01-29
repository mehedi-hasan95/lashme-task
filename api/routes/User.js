const router = require("express").Router();
const User = require("../../models/User");
const bcrypt = require("bcrypt");

// Start Register

router.post("/users", async (req, res) => {
    try {
        const saltRounds = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(req.body.password, saltRounds);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPass,
        });

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/users/:username", async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// End Register

module.exports = router;
