import { User } from '../data/models.js'
import fs from 'fs/promises'
import errors from '../utils/errors.js'
import validator from 'validator'
const { SystemError, NotFoundError, ContentError } = errors


export default async function uploadFile(userId, fileName, filePath, fileType) {
    const validateId = validator.isMongoId(userId)

    try {
        if (!validateId) {
            throw new ContentError('Invalid ID user. Try again')
        }

        if (
            fileName === undefined || validator.isEmpty(fileName) ||
            filePath === undefined || validator.isEmpty(filePath) ||
            fileType === undefined || validator.isEmpty(fileType)
        ) {
            throw new ContentError('Warning! Avatar image is empty or something happened...')
        }

        if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
            await fs.unlink(filePath)
            throw new ContentError('Invalid image format. Please, try only with png or jpeg extension.')
        }

        const user = await User.findById(userId)

        if (!user) {
            throw new NotFoundError('User not found. Try again')
        }

        // RENAME FILE PATH NAME
        await fs.rename(filePath, `./uploads/avatars/${fileName}`)

        user.image = fileName
        await user.save()

        return user

    } catch (error) {
        if (error instanceof NotFoundError || error instanceof ContentError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}