import { User } from '../data/models.js'
import errors from '../utils/errors.js'
import bcrypt from 'bcrypt'
import validator from 'validator'
const { SystemError, NotFoundError, ContentError, CredentialsError } = errors

export default async function changeUserPassword(userId, newPassword) {
    try {
        const validateId = validator.isMongoId(userId)
        const validateNewPassword = !validator.isEmpty(newPassword)

        if (!validateId) {
            throw new ContentError('Invalid ID user format. Check it again!')
        } else if (!validateNewPassword) {
            throw new ContentError('New password field is empty. Check it again!')
        } else if (newPassword.length < 8) {
            throw new ContentError('Warning! Password must have at least 8 characters')
        }

        const user = await User.findById(userId)

        if (!user) {
            throw new NotFoundError('User not found. Try again')
        }

        const match = await bcrypt.compare(newPassword, user.password)

        if (match) {
            throw new CredentialsError('This is your current password... Choose another')
        }

        const hashedPassword = await bcrypt.hash(newPassword, 5)

        user.password = hashedPassword
        await user.save()

    } catch (error) {
        if (error instanceof NotFoundError || error instanceof ContentError || error instanceof CredentialsError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}