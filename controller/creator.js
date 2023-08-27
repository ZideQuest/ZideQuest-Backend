import Account from "../model/account.js"
import { createError } from "../util/createError.js"
import Admin from "../model/admin.js"

export const createCreator = async (req, res, next) => {
    try {
        const { username, password, ...creatorInfo } = req.body
        const account = await Account.createAccount(username, password, "creator")
        try {
            let picturePath = ""
            if (req.file?.path) {
                let newPath = await cloudinaryUploadImg(req.file.path)
                picturePath = newPath.url
            }
            const creator = await Admin.create({
                ...creatorInfo,
                accountId: account._id,
                picturePath
            })
            return res.json(creator)
        } catch (error) {
            await Account.findByIdAndDelete(account._id)
            next(error)
        }
    } catch (error) {
        next(error)
    }
}

export const getCreator = async (req, res, next) => {
    try {
        const creators = await Admin.find({ role: "creator" })
        return res.json(creators)
    } catch (error) {
        next(error)
    }
}

export const getCreatorById = async (req, res, next) => {
    try {
        const creator = await Admin.findById(req.params.id)
        if (!creator) return next(createError(400, "Creator not found"))

        return res.json(creator)
    } catch (error) {
        next(error)
    }
}

export const deleteCreatorById = async (req, res, next) => {
    try {
        const creator = await Admin.findByIdAndDelete(req.params.id)
        if (!creator) return next(createError(400, "Creator not found"))

        const account = await Account.findByIdAndDelete(creator.accountId)
        return res.json({
            msg: `Delete Admin successfully`,
            accountId: creator.accountId,
            organizeName: creator.organizeName
        })
    } catch (error) {
        next(error)
    }
}

export const updateCreatorById = async (req, res, next) => {
    try {
        const creator = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!creator) return next(createError(400, "Creator not found"))

        return res.json({
            msg: `Update Admin successfully`,
            accountId: creator.accountId,
            organizeName: creator.organizeName
        })
    } catch (error) {
        next(error)
    }
}
