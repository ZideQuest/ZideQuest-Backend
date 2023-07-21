import Account from "../model/account.js"
import { generateToken, verifyToken } from "../util/tokenManager.js"
export const login = async (req, res, next) => {
    const { username, password } = req.body
    try {
        const account = await Account.login(username, password)
        const access_token = generateToken(account._id, account.role)
        const payload = verifyToken(access_token)

        res.json({
            access_token,
            payload
        })
    } catch (error) {
        next(error)
    }
}
