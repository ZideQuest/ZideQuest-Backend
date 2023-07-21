import Account from "../model/account.js"
import User from "../model/user.js"
import { createError } from "../util/createError.js"
export const createUser = async (req, res, next) => {
    try {
        const { username, password, ...userInfo } = req.body
        const account = await Account.createAccount(username, password, "user")
        try {
            const user = await User.create({
                ...userInfo,
                accountId: account._id
            })
            return res.json(user)
        } catch (error) {
            await Account.findByIdAndDelete(account._id)
            next(error)
        }
    } catch (error) {
        next(error)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const users = await User.find({})
        return res.json(users)
    } catch (error) {
        next(error)
    }
}

export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return next(createError(400, "User not found"))

        return res.json(user)
    } catch (error) {
        next(error)
    }
}

export const deleteUserById = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) return next(createError(400, "User not found"))

        const account = await Account.findByIdAndDelete(user.accountId)
        return res.json({ msg: `Delete User: ${user.nisitId} successfully` })
    } catch (error) {
        next(error)
    }
}

export const updateUserById = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!user) return next(createError(400, "User not found"))

        return res.json({ msg: `Update User: ${user.nisitId} successfully` })
    } catch (error) {
        next(error)
    }
}

