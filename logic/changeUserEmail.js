import { User } from '../data/models.js'
import validator from 'validator'
import errors from '../utils/errors.js'
const { SystemError, NotFoundError, ContentError } = errors

export default async function changeUserEmail(userId, newEmail) {
    const validateId = validator.isMongoId(userId)
    const validateEmptyEmail = !validator.isEmpty(newEmail)
    const validateFormatEmail = validator.isEmail(newEmail)

    try {
        if (!validateId) {
            throw new ContentError('Invalid user ID. Please, try again')
        } else if (!validateEmptyEmail) {
            throw new ContentError('New email field is empty. Check it again')
        } else if (!validateFormatEmail) {
            throw new ContentError('New email format is incorrect. Try again')
        }

        const user = await User.findById(userId)

        if (!user) {
            throw new NotFoundError('User not found. Try again')
        }

        if (user.email === newEmail) {
            throw new ContentError('Warning! New email and current email are the same...')
        }

        user.email = newEmail
        await user.save()

    } catch (error) {
        if (error instanceof NotFoundError || error instanceof ContentError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}
