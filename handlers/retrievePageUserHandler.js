import retrievePageUser from '../logic/retrievePageUser.js'
import jwt from 'jsonwebtoken'
import errors from '../utils/errors.js'
const { JsonWebTokenError } = jwt
const { NotFoundError, TokenError, ContentError } = errors

export default async (req, res) => {
    let page = req.params.page || 1

    try {
        const token = req.headers.authorization.substring(7)
        const { sub: userId } = jwt.verify(token, process.env.JWT_SECRET)

        const result = await retrievePageUser(userId, page)

        res.status(200).json({
            success: true,
            page: parseInt(page, 10),
            total: result.total,
            users: result.users
        })

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