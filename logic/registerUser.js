import { User } from '../data/models.js'
import bcrypt from 'bcrypt'
import validator from 'validator'
import errors from '../utils/errors.js'
const { SystemError, DuplicityError, ContentError } = errors

export default async function registerUser(name, surname, username, email, password) {
    const validateName = !validator.isEmpty(name)
    const validateSurname = !validator.isEmpty(surname)
    const validateUsername = !validator.isEmpty(username)
    const validateEmail = !validator.isEmpty(email)
    const validateEmailFormat = validator.isEmail(email)
    const validatePassword = !validator.isEmpty(password)

    try {

        if (!validateName || !validateSurname || !validateUsername || !validateEmail || !validatePassword) {
            throw new ContentError('Some values are empty... Please, try it again')
        } else if (!validateEmailFormat) {
            throw new ContentError('Email format is not valid. Try it again')
        } else if (password.length < 8) {
            throw new ContentError('Password must have 8 characters! Try it again')
        }

        const hash = await bcrypt.hash(password, 5)
        const user = await User.create({ name, surname, username, email, password: hash })

        await user.save()

        return user

    } catch (error) {
        if (error.code === 11000) {
            throw new DuplicityError('User already exist! Please, try it again')
        }

        if (error instanceof ContentError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}