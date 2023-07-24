import mongoose from "mongoose";
import bcrypt from "bcrypt"

const accountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: "user",
        enum: ["user", "creator", "admin"]
    },
    profilePicture: {
        type: String,
    },
}, {
    timestamps: true
})

/* CREATE ACCOUNT */
accountSchema.statics.createAccount = async function (username, password, role) {
    try {
        // validate
        if (!(username && password && role)) throw new Error("All field is required")

        // this account already exists
        const account = await this.findOne({ username })
        if (account) throw new Error("This username already registered")

        // hash password
        const salt = await bcrypt.genSalt()
        const hash = await bcrypt.hash(password, salt)

        // create account
        const newAccount = await this.create({
            username,
            password: hash,
            role,
        })
        return newAccount
    } catch (error) {
        throw error
    }
}
/* LOGIN */
accountSchema.statics.login = async function (username, password) {
    try {
        // validate
        if (!(username && password)) throw new Error("All field is required")

        // this account already exists
        const account = await this.findOne({ username })
        if (!account) throw new Error("Wrong username or password")

        // check password if match => return account 
        const match = await bcrypt.compare(password, account.password)
        if (!match) throw new Error("Wrong username or password")

        return account
    } catch (error) {
        throw error
    }
}

const Account = mongoose.models.Account || mongoose.model("Account", accountSchema)

export default Account