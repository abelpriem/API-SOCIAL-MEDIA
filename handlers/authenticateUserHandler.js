import jwt from 'jsonwebtoken'
import errors from '../utils/errors.js'
import session from '../logic/session.js'
import authenticateUser from '../logic/authenticateUser.js'
const { JsonWebTokenError } = jwt
const { NotFoundError, CredentialsError, ContentError, TokenError } = errors

export default async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await authenticateUser(email, password)
        const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRED })

        session.token = token

        res.status(200).json({ nickname: user.username, token: token })
    } catch (error) {
        let status = 500

        if (error instanceof NotFoundError) {
            status = 404
        }

        if (error instanceof ContentError || error instanceof TypeError) {
            status = 406
        }

        if (error instanceof CredentialsError) {
            status = 409
        }

        if (error instanceof JsonWebTokenError) {
            status = 401
            throw new TokenError(error.message)
        }

        res.status(status).json({ error: error.constructor.name, message: error.message })
    }
}