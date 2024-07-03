import mongoose from 'mongoose'
import dotenv from 'dotenv'
import errors from '../utils/errors.js'
import random from './helpers/random.js'
import retrieveUser from '../logic/retrieveUser.js'
import { expect } from 'chai'
import { User } from '../data/models.js'
const { NotFoundError, ContentError } = errors

dotenv.config()

describe('retrieveUser', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())

    // POSITIVE CASE
    it('Success on retrieve user', async () => {
        const user1 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const user2 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })

        const checkUser = await User.findById(user2.id)
        const result = await retrieveUser(user1.id, user2.id)

        expect(result).to.be.an('Object')
        expect(result.name).to.be.equal(user2.name)
        expect(result.surname).to.be.equal(user2.surname)
        expect(result.nick).to.be.equal(user2.username)
        expect(result.image).to.be.equal(checkUser.image)
    })

    // NEGATIVE CASE - Invalid user ID format
    it('Failure with invalid user ID', async () => {
        const userId = random.name()
        const userToSearchId = random.name()

        try {
            await retrieveUser(userId, userToSearchId)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Fails on ID format. Check it again')
        }
    })

    // NEGATIVE CASE - User not found
    it('Failure on user not found', async () => {
        const userId = random.id()
        const userToSearchId = random.id()

        try {
            await retrieveUser(userId.toString(), userToSearchId.toString())
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('Request user not found. Please, login again')
        }
    })

    // NEGATIVE CASE - User to search not found
    it('Failure on user to search not found', async () => {
        const user = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const userToSearchId = random.id()

        try {
            await retrieveUser(user.id, userToSearchId.toString())
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found. Try it again')
        }
    })

    after(() => mongoose.disconnect())
})

