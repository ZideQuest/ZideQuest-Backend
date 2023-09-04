import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    locationName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: [50, 'Your location name must be less than 50 characters'],
        minlength: [2, 'Your location name must be longer than 2 characters'],
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    picturePath: {
        type: String,
    },
    creatorId: {
        type: mongoose.Types.ObjectId,
        ref: "Admin",
    },
    description: {
        type: String
    }
}, {
    timestamps: true
})

const Location = mongoose.models.Location || mongoose.model("Location", locationSchema)
export default Location