import savePost from '../logic/savePost.js'
import jwt from 'jsonwebtoken'
import errors from '../utils/errors.js'
const { NotFoundError, TokenError } = errors
const { JsonWebTokenError } = jwt

export default async (req, res) => {
    try {
        const token = req.headers.authorization.substring(7)
        const { sub: userId } = jwt.verify(token, process.env.JWT_SECRET)

        const { text } = req.body
        const file = req.file

        let fileName, filePath, fileType

        if (file) {
            fileName = file.filename
            filePath = file.path
            fileType = file.mimetype
        }

        const newPost = await savePost(userId, text, fileName, filePath, fileType)
        res.status(201).json({ success: 'true', post: newPost })
    } catch (error) {
        let status = 500

        if (error instanceof NotFoundError) {
            status = 404
        }

        if (error instanceof JsonWebTokenError) {
            status = 401
            throw new TokenError(error.message)
        }

        res.status(status).json({ error: error.constructor.name, message: error.message })
    }
}