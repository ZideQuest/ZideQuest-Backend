import Account from "../model/account.js"
import Admin from "../model/admin.js"

export const createAdmin = async (req, res, next) => {
    try {
        const { username, password, ...userInfo } = req.body
        const account = await Account.createAccount(username, password, "admin")
        try {
            const user = await Admin.create({
                
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