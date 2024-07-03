import mongoose from 'mongoose'
import dotenv from 'dotenv'
import random from './helpers/random.js'
import bcrypt from 'bcrypt'
import errors from '../utils/errors.js'
import changeUserPassword from '../logic/changeUserPassword.js'
import { User } from '../data/models.js'
import { expect } from 'chai'
const { NotFoundError, ContentError, CredentialsError } = errors

dotenv.config()

describe('changeUserPassword', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())

    // POSITIVE CASE
    it('Success on change password user', async () => {
        const name = random.name()
        const surname = random.surname()
        const username = random.username()
        const email = random.email()
        const password = random.password()
        const newPassword = random.password()

        const hash = await bcrypt.hash(password, 5)

        const user = await User.create({ name, surname, username, email, password: hash })
        await changeUserPassword(user.id, newPassword)

        const checkUser = await User.findById(user.id).lean()
        const match = await bcrypt.compare(newPassword, checkUser.password)

        expect(checkUser).to.be.an('Object')
        expect(match).to.be.true
    })

    // NEGATIVE CASE - Invalid user ID format
    it('Failure with invalid user ID', async () => {
        const userId = random.name()
        const newPassword = random.password()

        try {
            await changeUserPassword(userId, newPassword)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Invalid ID user format. Check it again!')
        }
    })

    // NEGATIVE CASE - Empty new password
    it('Failure with empty new password', async () => {
        const userId = random.id()
        const newPassword = ''

        try {
            await changeUserPassword(userId.toString(), newPassword)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('New password field is empty. Check it again!')
        }
    })

    // NEGATIVE CASE - New password with less than 8 characters
    it('Failure on new password with less than 8 characters', async () => {
        const userId = random.id()
        const newPassword = '1234'

        try {
            await changeUserPassword(userId.toString(), newPassword)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Warning! Password must have at least 8 characters')
        }
    })

    // NEGATIVE CASE - User not found
    it('Failure on user not found', async () => {
        const userId = random.id()
        const newPassword = random.password()

        try {
            await changeUserPassword(userId.toString(), newPassword)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found. Try again')
        }
    })

    // NEGATIVE CASE - New password and current password are the same
    it('Failure on change password using new one with current password', async () => {
        const name = random.name()
        const surname = random.surname()
        const username = random.username()
        const email = random.email()
        const password = random.password()
        const newPassword = password

        const hash = await bcrypt.hash(password, 5)
        const user = await User.create({ name, surname, username, email, password: hash })

        try {
            await changeUserPassword(user.id, newPassword)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(CredentialsError)
            expect(error.message).to.be.equal('This is your current password... Choose another')
        }
    })

    after(() => mongoose.disconnect())
})