import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    questId: {
        type: mongoose.Types.ObjectId,
        ref: "Quest"
    },
    message: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
})

const Notification = mongoose.models.notification || mongoose.model("Notification", notificationSchema)
export default Notification