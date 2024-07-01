import changeUserEmail from '../logic/changeUserEmail.js'
import jwt from 'jsonwebtoken'
import errors from '../utils/errors.js'
const { NotFoundError, ContentError, TokenError } = errors
const { JsonWebTokenError } = jwt

export default async (req, res) => {
    const token = req.headers.authorization.substring(7)
    const { sub: userId } = jwt.verify(token, process.env.JWT_SECRET)

    const { newEmail } = req.body

    try {
        await changeUserEmail(userId, newEmail)
        res.status(200).send({ sucess: 'true', message: 'User succesfully updated!' })
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