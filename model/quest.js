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
    picturePath: {
        type: String,
    },
    tagId: [{
        type: mongoose.Types.ObjectId,
        ref: "Tag"
    }],
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
    }],
    countParticipant: {
        type: Number,
        default: 0
    },
    maxParticipant: {
        type: Number,
        default: 1
    },
    autoComplete: {
        type: Boolean,
        required: true,
    },
    notification: {
        type: mongoose.Types.ObjectId,
        ref: "Notification",
        default: null
    },
    isCancel: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const Quest = mongoose.models.Quest || mongoose.model("Quest", questSchema)
export default Quest