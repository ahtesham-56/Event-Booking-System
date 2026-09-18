const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        // User phone number
        phone: {
            type: String,
            default: "",
            trim: true,
        },

        // Profile picture URL
        profileImage: {
            type: String,
            default: "",
        },

        // Password reset token
        resetPasswordToken: {
            type: String,
            default: null,
        },

        // Password reset token expiry
        resetPasswordExpire: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);

