import Account from "../model/account.js"
import User from "../model/user.js"
import Admin from "../model/admin.js"
import Location from "../model/location.js"

import { createError } from "../util/createError.js"
import { ObjectId } from "mongoose/index.js"
import mongoose from "mongoose"
export const createUser = async (req, res, next) => {
    try {
        const { username, password, ...userInfo } = req.body
        const account = await Account.createAccount(username, password, "user")
        try {
            let picturePath = ""
            if (req.file?.path) {
                let newPath = await cloudinaryUploadImg(req.file.path)
                picturePath = newPath.url
            }

            const user = await User.create({
                ...userInfo,
                accountId: account._id,
                picturePath
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
        if (req.file?.path) {
            const newPath = await cloudinaryUploadImg(req.file.path)
            const picturePath = newPath.url
            user.picturePath = picturePath
            await user.save()
        }
        return res.json({ msg: `Update User: ${user.nisitId} successfully` })
    } catch (error) {
        next(error)
    }
}

export const getUserQuest = async (req, res, next) => {
    try {

        const { joinedQuest } = await User.findById(req.user.id).select('joinedQuest').populate(
            {
                path: 'joinedQuest',
                populate: {
                    path: 'locationId'
                }
            }
        )
        const currentQuest = []
        const successQuest = []

        // seperate a type of quest
        for (const quest of joinedQuest) {
            const location = await Location.findById(quest.locationId)
            if (quest.status !== true)
                currentQuest.push({ quest, location })
            else
                successQuest.push({ quest, location })
        }
        return res.json({ currentQuest, successQuest })
    } catch (error) {
        next(error)
    }
}

export const getUserActivity = async (req, res, next) => {
    try {
        const { activityTranscript } = await User.findById(req.user.id).select('activityTranscript')
        return res.json(activityTranscript)
    } catch (error) {
        next(error)
    }
}

export const getUserInfo = async (req, res, next) => {
    try {
        const { id, role } = req.user
        if (role == 'user') {
            const user = await User.findById(id).populate({
                path: 'joinedQuest',
                populate: {
                    path: 'locationId',
                }
            }).populate({
                path: 'notifications',
                populate: {
                    path: '_id'
                }
            })
            const level_now = Math.floor(Math.pow(Math.floor(user.level), 1.45) * 856)
            const level_next = Math.floor(Math.pow(Math.floor(user.level+1), 1.45) * 856)
            const maxXp = level_next-level_now
            let xpNow = user.exp-level_now
            if (xpNow < 0) {
                xpNow = 0
            }

            return res.json({
                ...user.toObject(),
                maxXp: maxXp,
                xpNow: xpNow,
                xpPercentage: (xpNow)/(maxXp)
            })
        }
        const user = await Admin.findById(id)

        return res.json(user)
    } catch (error) {
        next(error)
    }
} 

export const deleteUserNoti = async (req, res, next) => {
    try {
        const { id } = req.user
        const { notiId } = req.params

        console.log(`${id} ${notiId}`)

        const user = await User.findOneAndUpdate(
            new mongoose.Types.ObjectId(id),
            {
                $pull: {
                    notifications: notiId
                }
            },
            {new: true}
        )

        return res.json(user)

    } catch (error) {
        next(error)
    }
}