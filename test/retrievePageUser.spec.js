import mongoose from 'mongoose'
import dotenv from 'dotenv'
import errors from '../utils/errors.js'
import random from './helpers/random.js'
import retrievePageUser from '../logic/retrievePageUser.js'
import { expect } from 'chai'
import { User } from '../data/models.js'
const { NotFoundError, ContentError } = errors

dotenv.config()

describe('retrievePageUser', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())

    // POSITIVE CASE
    it('Success on retrieve pages of users', async () => {
        let page = 2

        const user1 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const user2 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const user3 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const user4 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const user5 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const user6 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })

        const { users, total } = await retrievePageUser(user1.id, page)

        expect(users).to.be.an('Array').that.has.lengthOf(2)
        expect(users[0]._id.toString()).to.be.equal(user3._id.toString())
        expect(users[1]._id.toString()).to.be.equal(user4._id.toString())
        expect(total).to.be.equal(6)
    })

    // NEGATIVE CASE - Invalid user ID format
    it('Failure with invalid user ID', async () => {
        let page = 2
        const userId = random.name()

        try {
            await retrievePageUser(userId, page)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Invalid ID user... Try it again')
        }
    })

    // NEGATIVE CASE - User not found
    it('Failure on user not found', async () => {
        let page = 2
        const userId = random.id()

        try {
            await retrievePageUser(userId.toString(), page)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found. Try again')
        }
    })

    // NEGATIVE CASE - No users on selected page
    it('Failure with no user on selected page', async () => {
        let page = 3

        const user1 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const user2 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const user3 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const user4 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })


        try {
            await retrievePageUser(user1.id, page)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('There are no users on that page yet!')
        }
    })

    after(() => mongoose.disconnect())
})

