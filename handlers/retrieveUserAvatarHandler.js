import jwt from 'jsonwebtoken'
import path from 'path'
import retrieveUserAvatar from '../logic/retrieveUserAvatar.js'
import errors from '../utils/errors.js'
const { NotFoundError, TokenError, ContentError } = errors
const { JsonWebTokenError } = jwt

export default async (req, res) => {
    try {
        const token = req.headers.authorization.substring(7)
        const { sub: userId } = jwt.verify(token, process.env.JWT_SECRET)

        const fileName = req.params.name

        const avatarPath = await retrieveUserAvatar(userId, fileName)
        const avatar = path.resolve(avatarPath)

        res.sendFile(avatar)
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
