import { createError } from "../util/createError.js"
import { verifyToken } from "../util/tokenManager.js"


export const verify = (req, res, next) => {
    try {
        // Check authorization token is in the header ?
        const { authorization } = req.headers
        if (!authorization || !authorization.startsWith("Bearer ")) {
            return next()
        }

        // Extract the token without the "Bearer " prefix
        const token = authorization.slice(7)

        // Verify token
        const { id, role } = verifyToken(token)

        // keep id and role in request for the next handler function
        req.user = { id, role }
        next()
    } catch (error) {
        next(error)
    }
}


export const verifyUser = (req, res, next) => {
    try {
        // Check authorization token is in the header ?
        const { authorization } = req.headers
        if (!authorization || !authorization.startsWith("Bearer ")) {
            return next(createError(401, "Unauthorize"))
        }

        // Extract the token without the "Bearer " prefix
        const token = authorization.slice(7)

        // Verify token
        const { id, role } = verifyToken(token)

        // keep id and role in request for the next handler function
        req.user = { id, role }
        next()
    } catch (error) {
        next(error)
    }
}

export const verifyCreator = (req, res, next) => {
    try {
        // Check authorization token is in the header ?
        const { authorization } = req.headers
        if (!authorization || !authorization.startsWith("Bearer ")) {
            return next(createError(401, "Unauthorize"))
        }

        // Extract the token without the "Bearer " prefix
        const token = authorization.slice(7)

        // Verify token
        const { id, role } = verifyToken(token)
        if (role === "user") {
            return next(createError(401, "Permission Denied"))
        }
        // keep id and role in request for the next handler function
        req.user = { id, role }

        next()
    } catch (error) {
        next(error)
    }
}

export const verifyAdmin = (req, res, next) => {
    try {
        // Check authorization token is in the header ?
        const { authorization } = req.headers
        if (!authorization || !authorization.startsWith("Bearer ")) {
            return next(createError(401, "Unauthorize"))
        }

        // Extract the token without the "Bearer " prefix
        const token = authorization.slice(7)

        // Verify token
        const { id, role } = verifyToken(token)
        if (role !== "admin") {
            return next(createError(401, "Unauthorize. You are not admin"))
        }
        // keep id and role in request.user for the next handler function
        req.user = { id, role }
        next()
    } catch (error) {
        next(error)
    }
}

