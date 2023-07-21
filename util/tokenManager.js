// pacakge import
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

// dotenv
dotenv.config()

// public key & private key 
const publicKey = process.env.PUBLIC_KEY
const privateKey = process.env.PRIVATE_KEY


export const generateToken = (id, role) => {
    try {
        const token = jwt.sign({ id, role }, privateKey, { algorithm: "RS256", expiresIn: "10s" })
        return token
    } catch (error) {
        throw error
    }
}
export const verifyToken = (token) => {
    try {
        const payload = jwt.verify(token, publicKey)
        return payload
    } catch (error) {
        throw error
    }
}