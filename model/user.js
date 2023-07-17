import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    nisitId: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    faculty: {
        type: String,
        require: true
    },
    accountId: {
        type: mongoose.Types.ObjectId,
        ref: "Account"
    }
}, {
    timestamps: true
})

const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User