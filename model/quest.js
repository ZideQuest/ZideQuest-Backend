import mongoose from "mongoose";

const questSchema = new mongoose.Schema({
    questName: {
        type: String,
        required: true,
    },
    creatorId: {
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
    status: {
        type: Boolean,
        default: false
    },
    activityHour: {
        category: {
            type: String,
            enum: ["1", "2.1", "2.2", "2.3", "2.4", "3"]
        },
        hour: {
            type: Number
        }
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

const Quest = mongoose.models.Quest || mongoose.model("quest", questSchema)
export default Quest