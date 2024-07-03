import mongoose from 'mongoose'
import dotenv from 'dotenv'
import errors from '../utils/errors.js'
import random from './helpers/random.js'
import retrieveAllPosts from '../logic/retrieveAllPosts.js'
import { expect } from 'chai'
import { User, Post } from '../data/models.js'
const { NotFoundError, ContentError } = errors

dotenv.config()

describe('retrieveAllPosts', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())
    beforeEach(() => Post.deleteMany())

    // POSITIVE CASE
    it('Success on retrieve all posts', async () => {
        const user1 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const user2 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })

        await Post.create({ user: user1.id, text: random.text(), created_at: Date.now() })
        await Post.create({ user: user1.id, text: random.text(), created_at: Date.now() })
        await Post.create({ user: user2.id, text: random.text(), created_at: Date.now() })
        await Post.create({ user: user2.id, text: random.text(), created_at: Date.now() })

        const posts = await retrieveAllPosts(user2.id)

        expect(posts).to.be.an('Array').that.has.lengthOf(4)
        expect(posts[0].user.toString()).to.be.equal(user1.id)
        expect(posts[1].user.toString()).to.be.equal(user1.id)
        expect(posts[2].user.toString()).to.be.equal(user2.id)
        expect(posts[3].user.toString()).to.be.equal(user2.id)
    })

    // NEGATIVE CASE - Invalid user ID format
    it('Failure with invalid user ID', async () => {
        const userId = random.name()

        try {
            await retrieveAllPosts(userId)
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
            await retrieveAllPosts(userId.toString())
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found. Try again')
        }
    })

    // NEGATIVE CASE - No posts created yet
    it('Failure with no posts created on BDD', async () => {
        const user = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })

        try {
            await retrieveAllPosts(user.id)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('No posts created yet!')
        }
    })


    after(() => mongoose.disconnect())
})

