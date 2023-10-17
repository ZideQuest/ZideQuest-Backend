import Account from "../model/account.js"
import User from "../model/user.js"
import Admin from "../model/admin.js"
import { generateToken, verifyToken } from "../util/tokenManager.js"

export const login = async (req, res, next) => {
    const { username, password } = req.body
    try {
        // account login
        const account = await Account.login(username, password)

        let user;
        // this account is user or admin ? 
        if (account.role === "user") { // this account is user
            user = await User.findOne({ accountId: account._id }).populate('notifications').populate('joinedQuest')
            user.joinedQuest = user.joinedQuest.filter((quest) => {
                return quest.status === false && quest.isCancel === false
            })
        } else { // this account is admin
            user = await Admin.findOne({ accountId: account._id })
        }

        // generate authorization token
        const token = generateToken(user._id, account.role)

        return res.json({ token, user })
    } catch (error) {
        next(error)
    }
}

export const test = async (req, res, next) => {
    try {
        const { id, role } = req.user
        let user;
        if (role === "user") {
            user = await User.findById(id)
        } else {
            user = await Admin.findById(id)
        }
        res.json(user)
    } catch (error) {
        next(error)
    }
}


