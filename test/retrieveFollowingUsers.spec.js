import mongoose from 'mongoose'
import dotenv from 'dotenv'
import errors from '../utils/errors.js'
import random from './helpers/random.js'
import retrieveFollowingUsers from '../logic/retrieveFollowingUsers.js'
import { expect } from 'chai'
import { User, Follow } from '../data/models.js'
const { NotFoundError, ContentError } = errors

dotenv.config()

describe('retrieveFollowingUsers', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())
    beforeEach(() => Follow.deleteMany())

    // POSITIVE CASE
    it('Success in retrieve all following users', async () => {
        const user = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const user2 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const user3 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const user4 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })

        await Follow.create({ user: user.id, followed: user2.id, created_at: Date.now() })
        await Follow.create({ user: user.id, followed: user3.id, created_at: Date.now() })
        await Follow.create({ user: user.id, followed: user4.id, created_at: Date.now() })

        const usersFollowing = await retrieveFollowingUsers(user.id)

        expect(usersFollowing).to.be.an('Array').that.has.lengthOf(3)
        expect(usersFollowing[0]).to.be.equal(user2.id)
        expect(usersFollowing[1]).to.be.equal(user3.id)
        expect(usersFollowing[2]).to.be.equal(user4.id)
    })

    // NEGATIVE CASE - Invalid user ID format
    it('Failure with invalid user ID', async () => {
        const userId = random.name()

        try {
            await retrieveFollowingUsers(userId)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Invalid ID user. Try again')
        }
    })

    // NEGATIVE CASE - User not found
    it('Failure on user not found', async () => {
        const userId = random.id()

        try {
            await retrieveFollowingUsers(userId.toString())
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found. Please, check it again')
        }
    })

    // NEGATIVE CASE - No following no users yet
    it('Failure with user does not following users yet', async () => {
        const user = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const user2 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })

        await Follow.create({ user: user2.id, followed: user.id, created_at: Date.now() })

        try {
            await retrieveFollowingUsers(user.id)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('There is no following any users yet...')
        }
    })

    after(() => mongoose.disconnect())
})

