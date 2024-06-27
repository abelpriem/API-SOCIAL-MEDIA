import jwt from 'jsonwebtoken'
import errors from '../utils/errors.js'
import session from '../logic/session.js'
const { JsonWebTokenError } = jwt
const { TokenError } = errors

export default async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        res.status(403).send({
            status: "Error",
            message: "Request hasnt authorization header"
        })
    }

    try {
        session.token = authHeader.split(' ')[1]

        const decoded = jwt.verify(session.token, process.env.JWT_SECRET)

        req.user = decoded
        next()
    } catch (error) {
        let status = 500

        if (error instanceof JsonWebTokenError) {
            status = 401
            throw new TokenError('Invalid token')
        }

        res.status(status).json({ error: error.constructor.name, message: error.message })
    }
}