import Account from "../model/account.js"
import Admin from "../model/admin.js"

export const createAdmin = async (req, res, next) => {
    try {
        const { username, password, ...adminInfo } = req.body
        const account = await Account.createAccount(username, password, "admin")
        try {
            const admin = await Admin.create({
                
                ...adminInfo,
                accountId: account._id
            })
            return res.json(admin)
        } catch (error) {
            await Account.findByIdAndDelete(account._id)
            next(error)
        }
    } catch (error) {
        next(error)
    }
}

export const getAdmin = async (req, res, next) => {
    try {
        const admins = await Admin.find({role: "admin"})
        return res.json(admins)
    } catch (error) {
        next(error)
    }
}

export const getAdminById = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.params.id)
        if (admin.role != "admin") return next(createError(400, "Admin not found"))
        if (!admin) return next(createError(400, "Admin not found"))

        return res.json(admin)
    } catch (error) {
        next(error)
    }
}

export const deleteAdminById = async (req, res, next) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id)
        if (admin.role != "admin") return next(createError(400, "Admin not found"))
        if (!admin) return next(createError(400, "Admin not found"))

        const account = await Account.findByIdAndDelete(admin.accountId)
        return res.json({ msg: `Delete Admin successfully`,
                        accountId: admin.accountId,
                        organizeName: admin.organizeName })
    } catch (error) {
        next(error)
    }
}

export const updateAdminById = async (req, res, next) => {
    try {
        const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (admin.role != "admin") return next(createError(400, "Admin not found"))
        if (!admin) return next(createError(400, "Admin not found"))
        
        return res.json({ msg: `Update Admin successfully`,
                        accountId: admin.accountId,
                        organizeName: admin.organizeName })
    } catch (error) {
        next(error)
    }
}
