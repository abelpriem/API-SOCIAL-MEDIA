import mongoose from 'mongoose'
import dotenv from 'dotenv'
import random from './helpers/random.js'
import errors from '../utils/errors.js'
import saveFollow from '../logic/saveFollow.js'
import { User, Follow } from '../data/models.js'
import { expect } from 'chai'
const { NotFoundError, ContentError, DuplicityError } = errors

dotenv.config()

describe('saveFollow', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())
    beforeEach(() => Follow.deleteMany())

    // POSITIVE CASE
    it('Success on save a follow', async () => {
        const user1 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const user2 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })

        const follow = await saveFollow(user1.id, user2.id)

        expect(follow.user.toString()).to.be.equal(user1.id)
        expect(follow.followed.toString()).to.be.equal(user2.id)
    })

    // NEGATIVE CASE - Invalid user ID format
    it('Failure with invalid user ID', async () => {
        const userId = random.name()
        const userToFollow = random.id()

        try {
            await saveFollow(userId, userToFollow.toString())
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Invalid ID user... Try again')
        }
    })

    // NEGATIVE CASE - Invalid follower ID format
    it('Failure with invalid ID user to follow', async () => {
        const userId = random.id()
        const userToFollow = random.name()

        try {
            await saveFollow(userId.toString(), userToFollow)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Invalid ID user... Try again')
        }
    })

    // NEGATIVE CASE - User not found
    it('Failure on user not found', async () => {
        const userId = random.id()
        const userToFollow = random.id()

        try {
            await saveFollow(userId.toString(), userToFollow.toString())
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found. Try again')
        }
    })

    // NEGATIVE CASE - Follower not found
    it('Failure on user to follow not found', async () => {
        const user = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const userToFollow = random.id()

        try {
            await saveFollow(user.id, userToFollow.toString())
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('The user to follow cannot be found. Please try again')
        }
    })

    // NEGATIVE CASE - Follow already exist
    it('Failure on follow already exist', async () => {
        const user1 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const user2 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })

        await Follow.create({ user: user1.id, followed: user2.id })

        try {
            await saveFollow(user1.id, user2.id)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(DuplicityError)
            expect(error.message).to.be.equal('You already followed the user! Check it again')
        }
    })

    after(() => mongoose.disconnect())
})