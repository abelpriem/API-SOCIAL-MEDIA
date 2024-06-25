import { User } from '../data/models.js'
import bcrypt from 'bcrypt'
import validator from 'validator'
import errors from '../utils/errors.js'
const { NotFoundError, CredentialsError, ContentError, SystemError } = errors

export default async function authenticateUser(email, password) {
    const validateEmail = !validator.isEmpty(email)
    const validateEmailFormat = validator.isEmail(email)
    const validatePassword = !validator.isEmpty(password)

    try {
        if (!validateEmail || !validatePassword) {
            throw new ContentError('Some values are empty... Please, try it again')
        } else if (!validateEmailFormat) {
            throw new ContentError('Email format is not valid. Try it again')
        }

        const user = await User.findOne({ email }).lean()
        if (!user) {
            throw new NotFoundError('User not found. Try it again')
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            throw new CredentialsError('Wrong credentials... Try again')
        }

        return user._id
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof ContentError || error instanceof CredentialsError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}