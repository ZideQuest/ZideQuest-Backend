import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const Participant = mongoose.models.Participant || mongoose.model("Participant", participantSchema)
export default Participant