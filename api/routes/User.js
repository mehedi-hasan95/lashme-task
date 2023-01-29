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

// Get a User
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

// follow a user
router.put("/users/:username/follow", (req, res) => {
    User.findByIdAndUpdate(
        req.body.followId,
        {
            $push: { followers: req.user._id },
        },
        {
            new: true,
        },
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            User.findByIdAndUpdate(
                req.user._id,
                {
                    $push: { following: req.body.followId },
                },
                { new: true }
            )
                .select({ password: 0 })
                .then((result) => {
                    res.json(result);
                })
                .catch((err) => {
                    return res.status(500).json({ error: err });
                });
        }
    );
});

// Unfollow a user

router.put("/unfollow", (req, res) => {
    User.findByIdAndUpdate(
        req.body.unfollowId,
        {
            $pull: { followers: req.user._id },
        },
        {
            new: true,
        },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: err });
            }
            User.findByIdAndUpdate(
                req.user._id,
                {
                    $pull: { following: req.body.unfollowId },
                },
                { new: true }
            )
                .select({ password: 0 })
                .then((result) => {
                    res.json(result);
                })
                .catch((err) => {
                    return res.status(422).json({ error: err });
                });
        }
    );
});

module.exports = router;
