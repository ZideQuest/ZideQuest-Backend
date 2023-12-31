import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    picturePath: {
        type: String,
    },
    accountId: {
        type: mongoose.Types.ObjectId,
        ref: "Account"
    },
    organizeName: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        enum: ["admin", "creator"],
        default: "creator"
    }
}, {
    timestamps: true
})

const Admin = mongoose.models.admin || mongoose.model("Admin", adminSchema)
export default Admin