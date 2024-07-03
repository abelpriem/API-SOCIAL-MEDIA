import mongoose from 'mongoose'
import dotenv from 'dotenv'
import errors from '../utils/errors.js'
import random from './helpers/random.js'
import retrieveFollowersUsers from '../logic/retrieveFollowersUsers.js'
import { expect } from 'chai'
import { User, Follow } from '../data/models.js'
const { NotFoundError, ContentError } = errors

dotenv.config()

describe('retrieveFollowersUsers', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())
    beforeEach(() => Follow.deleteMany())

    // POSITIVE CASE
    it('Success on retrieve all user followers', async () => {
        const user = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const user2 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const user3 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const user4 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })

        await Follow.create({ user: user2.id, followed: user.id, created_at: Date.now() })
        await Follow.create({ user: user3.id, followed: user.id, created_at: Date.now() })
        await Follow.create({ user: user4.id, followed: user.id, created_at: Date.now() })

        const userFollowers = await retrieveFollowersUsers(user.id)

        expect(userFollowers).to.be.an('Array').that.has.lengthOf(3)
        expect(userFollowers[0]).to.be.equal(user2.id)
        expect(userFollowers[1]).to.be.equal(user3.id)
        expect(userFollowers[2]).to.be.equal(user4.id)
    })

    // NEGATIVE CASE - Invalid user ID format
    it('Failure with invalid user ID', async () => {
        const userId = random.name()

        try {
            await retrieveFollowersUsers(userId)
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
            await retrieveFollowersUsers(userId.toString())
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found. Please, check it again')
        }
    })

    // NEGATIVE CASE - User without followers yet
    it('Failure with user does not have followers yet', async () => {
        const user = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const user2 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })

        await Follow.create({ user: user.id, followed: user2.id, created_at: Date.now() })

        try {
            await retrieveFollowersUsers(user.id)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('Nobody follows you yet!')
        }
    })

    after(() => mongoose.disconnect())
})

