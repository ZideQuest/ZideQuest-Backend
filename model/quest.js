import mongoose from "mongoose";

const questSchema = new mongoose.Schema({
    questName: {
        type: String,
        require: true,
    },
    adminId: {
        type: mongoose.Types.ObjectId,
        ref: "Admin",
    },
    locationId: {
        type: mongoose.Types.ObjectId,
        ref: "Location",
    },
    timeStart: {
        type: Date,
        require: true,
    },
    timeEnd: {
        type: Date,
        require: true,
    },
    description: {
        type: String,
    },
    imagePath: [{
        type: String,
    }],
    tagId: [{
        type: mongoose.Types.ObjectId,
        ref: "Tag"
    }],
    questStatus: {
        type: Boolean,
        default: false
    },
    maxParticipant: {
        type: Number,
    },
    qrCode: {
        type: Number,
    },
    participant: [{
        type: mongoose.Types.ObjectId,
        ref: "Participant",
    }]
}, {
    timestamps: true
})

const Quest = mongoose.model("quest", questSchema)
export default Quest