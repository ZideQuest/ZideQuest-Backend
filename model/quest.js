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
    image: {
        type: Array,
    },
    tagId: [{
        type: mongoose.Types.ObjectId,
        ref: "Tag"
    }],
    questStatus: {
        type: Boolean,
        default: false
    },
    maxParticipant: {
        type: Int16Array,
    },
    qrCode: {
        type: Int16Array,
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