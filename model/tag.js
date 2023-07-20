import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
    tagName: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        maxlength: [30,'Your tag name must be less than 30 characters'],
        minlength: [2,'Your tag name must be longer than 2 characters'],
    },
}, {
    timestamps: true
})

const Tag = mongoose.models.Tag || mongoose.model("Tag", tagSchema)
export default Tag