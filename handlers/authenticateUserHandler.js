import jwt from 'jsonwebtoken'
import errors from '../utils/errors.js'
import authenticateUser from '../logic/authenticateUser.js'
const { JsonWebTokenError } = jwt
const { NotFoundError, CredentialsError, ContentError, TokenError } = errors

export default async (req, res) => {
    const { email, password } = req.body

    try {
        const userId = await authenticateUser(email, password)
        const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET)

        res.status(200).json({ id: userId, sign: token })
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