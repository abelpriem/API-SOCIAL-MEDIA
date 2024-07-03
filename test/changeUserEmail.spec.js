import mongoose from 'mongoose'
import dotenv from 'dotenv'
import random from './helpers/random.js'
import errors from '../utils/errors.js'
import changeUserEmail from '../logic/changeUserEmail.js'
import { User } from '../data/models.js'
import { expect } from 'chai'
const { NotFoundError, ContentError } = errors

dotenv.config()

describe('changeUserEmail', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())

    // POSITIVE CASE
    it('Success on change email user', async () => {
        const name = random.name()
        const surname = random.surname()
        const username = random.username()
        const email = random.email()
        const newEmail = random.email()
        const password = random.password()

        const user = await User.create({ name, surname, username, email, password })
        await changeUserEmail(user.id, newEmail)

        const checkUser = await User.findById(user.id).lean()

        expect(checkUser).to.be.an('Object')
        expect(checkUser.email).to.be.equal(newEmail)
    })

    // NEGATIVE CASE - Invalid user ID format
    it('Failure on change email user with invalid user ID', async () => {
        const userId = random.name()
        const newEmail = random.email()

        try {
            await changeUserEmail(userId, newEmail)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Invalid user ID. Please, try again')
        }
    })

    // NEGATIVE CASE - Empty new email
    it('Failure on change email user with empty new email', async () => {
        const userId = random.id()
        const newEmail = ''

        try {
            await changeUserEmail(userId.toString(), newEmail)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('New email field is empty. Check it again')
        }
    })

    // NEGATIVE CASE - Invalid email format
    it('Failure on change email user with invalid email format', async () => {
        const userId = random.id()
        const newEmail = `email-${Math.random()}`

        try {
            await changeUserEmail(userId.toString(), newEmail)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('New email format is incorrect. Try again')
        }
    })

    // NEGATIVE CASE - User not found
    it('Failure on user not found', async () => {
        const userId = random.id()
        const newEmail = random.email()

        try {
            await changeUserEmail(userId.toString(), newEmail)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found. Try again')
        }
    })

    // NEGATIVE CASE - New email and current email are the same
    it('Failure on change email user with new email as the current email', async () => {
        const name = random.name()
        const surname = random.surname()
        const username = random.username()
        const email = random.email()
        const newEmail = email
        const password = random.password()

        const user = await User.create({ name, surname, username, email, password })

        try {
            await changeUserEmail(user.id, newEmail)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Warning! New email and current email are the same...')
        }
    })

    after(() => mongoose.disconnect())
})