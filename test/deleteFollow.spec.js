import mongoose from 'mongoose'
import dotenv from 'dotenv'
import random from './helpers/random.js'
import errors from '../utils/errors.js'
import deleteFollow from '../logic/deleteFollow.js'
import { User, Follow } from '../data/models.js'
import { expect } from 'chai'
const { NotFoundError, ContentError } = errors

dotenv.config()

describe('deleteFollow', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())
    beforeEach(() => Follow.deleteMany())

    // POSITIVE CASE
    it('Success on delete a follow', async () => {
        const user1 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const user2 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })

        const follow = await Follow.create({ user: user1.id, followed: user2.id, created_at: Date.now() })

        await deleteFollow(user1.id, user2.id)

        const chechFollow = await Follow.findById(follow.id).lean()

        expect(chechFollow).to.be.null
    })

    // NEGATIVE CASE - Invalid user ID format
    it('Failure with invalid user ID', async () => {
        const userId = random.name()
        const followedId = random.id()

        try {
            await deleteFollow(userId, followedId.toString())
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Invalid ID user... Try again')
        }
    })

    // NEGATIVE CASE - Invalid followed ID format
    it('Failure with invalid followed ID', async () => {
        const userId = random.id()
        const followedId = random.name()

        try {
            await deleteFollow(userId.toString(), followedId)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Invalid ID user... Try again')
        }
    })

    // NEGATIVE CASE - User not found
    it('Failure on user not found', async () => {
        const userId = random.id()
        const followedId = random.id()

        try {
            await deleteFollow(userId.toString(), followedId.toString())
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found... Try again')
        }
    })

    // NEGATIVE CASE - Followed not found
    it('Failure on followed not found', async () => {
        const user = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const followedId = random.id()

        try {
            await deleteFollow(user.id, followedId.toString())
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User followed not found... Try again')
        }
    })

    // NEGATIVE CASE - Follow not found
    it('Failure on follow not found', async () => {
        const user1 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const user2 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })

        try {
            await deleteFollow(user1.id, user2.id)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('You havent stopped following anyone!')
        }
    })

    after(() => mongoose.disconnect())
})