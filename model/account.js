import mongoose from "mongoose";
import bcrypt from "bcrypt"

const accountSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        require: true,
        default: "user",
        enum: ["user", "admin"]
    },
    profilePicture: {
        type: String,
    },
}, {
    timestamps: true
})

const Account = mongoose.models.Account || mongoose.model("Account", accountSchema)

/* CREATE ACCOUNT */

accountSchema.statics.createAccount = async function (username, password, role) {
    try {
        // validate
        if (!(username && password && role)) throw new Error("All field is required")

        // this account already exists
        const account = await Account.find({ username })
        if (account) throw new Error("This username already registered")

        // hash password
        const salt = await bcrypt.genSalt()
        const hash = await bcrypt.hash(password, salt)

        // create account
        const newAccount = await Account.create({
            username,
            password: hash,
            role,
        })
        return newAccount
    } catch (error) {
        throw error
    }
}
export default Account