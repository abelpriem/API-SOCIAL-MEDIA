import validator from 'validator'
import fs from 'fs/promises'
import { User } from '../data/models.js'
import errors from '../utils/errors.js'
const { SystemError, NotFoundError, ContentError } = errors

export default async function retrieveUserAvatar(userId, fileName) {
    const validateId = validator.isMongoId(userId)

    try {
        if (!validateId) {
            throw new ContentError('Invalid ID user. Try again')
        }

        const user = await User.findById(userId).lean()

        if (!user) {
            throw new NotFoundError('User not found. Please, try again')
        }

        const filePath = `./uploads/avatars/${fileName}`
        await fs.stat(filePath)

        return filePath
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new NotFoundError('Avatar/image not found. Please, check the name or the path')
        }

        if (error instanceof NotFoundError || error instanceof ContentError || error instanceof fs.error) {
            throw error
        }

        throw new SystemError(error.message)
    }
}