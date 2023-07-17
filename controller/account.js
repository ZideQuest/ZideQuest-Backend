import Account from "../model/account.js"

export async function getAccount(req, res, next) {
    try {
        const users = await Account.find({})
        return res.json(users)
    } catch (error) {
        console.log("second")
        next(error)
    }
}
// add hashing 
export async function createAccount(req, res, next) {
    const { username, password } = req.body
    const user = await Account.create({
        username: username,
        password: password
    })
    return res.json(user)
}