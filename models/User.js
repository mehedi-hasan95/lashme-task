const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        followers: [{ type: ObjectId }],
        following: [{ type: ObjectId }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
