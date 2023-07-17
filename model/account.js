import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    profilePicture: {
        type: String,
    },
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        require: true,
        default: "user"
    },
}, {
    timestamps: true
})

const Account = mongoose.model("Account", accountSchema)
export default Account