import saveFollow from '../logic/saveFollow.js'
import errors from '../utils/errors.js'
import jwt from 'jsonwebtoken'
const { NotFoundError, TokenError, ContentError, DuplicityError } = errors
const { JsonWebTokenError } = jwt

export default async (req, res) => {
    try {
        const token = req.headers.authorization.substring(7)
        const { sub: userId } = jwt.verify(token, process.env.JWT_SECRET)

        const { userToFollow } = req.body

        if (!userToFollow) {
            throw new ContentError('userToFollow is required')
        }

        const userFollowed = await saveFollow(userId, userToFollow)
        res.status(200).json({ success: 'true', message: 'User succesfully followed!', user: userId, follow: userFollowed })

    } catch (error) {
        let status = 500

        if (error instanceof NotFoundError) {
            status = 404
        }

        if (error instanceof ContentError || error instanceof DuplicityError || error instanceof TypeError) {
            status = 409
        }

        if (error instanceof JsonWebTokenError) {
            status = 401
            throw new TokenError(error.message)
        }

        res.status(status).json({ error: error.constructor.name, message: error.message })
    }
}