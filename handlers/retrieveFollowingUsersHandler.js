import retrieveFollowingUsers from '../logic/retrieveFollowingUsers.js'
import errors from '../utils/errors.js'
import jwt from 'jsonwebtoken'
const { NotFoundError, ContentError, TokenError } = errors
const { JsonWebTokenError } = jwt

export default async (req, res) => {
    try {
        const token = req.headers.authorization.substring(7)
        const { sub: userId } = jwt.verify(token, process.env.JWT_SECRET)

        const followingUsers = await retrieveFollowingUsers(userId)
        res.status(200).send({ success: 'true', user: userId, message: 'All following users: ', following: followingUsers })
    } catch (error) {
        let status = 500

        if (error instanceof NotFoundError) {
            status = 404
        }

        if (error instanceof ContentError || error instanceof TypeError) {
            status = 409
        }

        if (error instanceof JsonWebTokenError) {
            status = 401
            throw new TokenError(error.message)
        }

        res.status(status).json({ error: error.constructor.name, message: error.message })
    }
}