import deleteFollow from '../logic/deleteFollow.js'
import errors from '../utils/errors.js'
import jwt from 'jsonwebtoken'
const { JsonWebTokenError } = jwt
const { NotFoundError, TokenError, ContentError } = errors

export default async (req, res) => {
    try {
        const token = req.headers.authorization.substring(7)
        const { sub: userId } = jwt.verify(token, process.env.JWT_SECRET)

        const followedId = req.params.followedId

        await deleteFollow(userId, followedId)
        res.status(200).json({ success: 'true', message: 'Follow succesfully removed!' })

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