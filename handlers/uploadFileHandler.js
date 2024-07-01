import jwt from 'jsonwebtoken'
import errors from '../utils/errors.js'
import uploadFile from '../logic/uploadFile.js'
const { JsonWebTokenError } = jwt
const { NotFoundError, ContentError, TokenError } = errors


export default async (req, res) => {
    try {
        const token = req.headers.authorization.substring(7)
        const { sub: userId } = jwt.verify(token, process.env.JWT_SECRET)

        const file = req.file

        const userUpdated = await uploadFile(userId, file.originalname, file.path, file.mimetype)

        res.status(200).send({ success: 'true', file: file, userUpdated: userUpdated })
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