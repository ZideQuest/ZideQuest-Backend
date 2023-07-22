import mongoose from "mongoose";

const questSchema = new mongoose.Schema({
    questName: {
        type: String,
        required: true,
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
        required: true,
    },
    timeEnd: {
        type: Date,
        required: true,
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
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        status: {
            type: Boolean,
            default: false
        }
    }]
}, {
    timestamps: true
})

const Quest = mongoose.model("quest", questSchema)
export default Quest