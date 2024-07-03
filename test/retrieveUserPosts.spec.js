import mongoose from 'mongoose'
import dotenv from 'dotenv'
import errors from '../utils/errors.js'
import random from './helpers/random.js'
import retrieveUserPosts from '../logic/retrieveUserPosts.js'
import { expect } from 'chai'
import { User, Post } from '../data/models.js'
const { NotFoundError, ContentError } = errors

dotenv.config()

describe('retrieveUserPosts', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())
    beforeEach(() => Post.deleteMany())

    // POSITIVE CASE
    it('Success on retrieve user posts', async () => {
        const user = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })

        const post1 = await Post.create({ user: user.id, text: random.text(), created_at: Date.now() })
        const post2 = await Post.create({ user: user.id, text: random.text(), created_at: Date.now() })
        const post3 = await Post.create({ user: user.id, text: random.text(), created_at: Date.now() })

        const posts = await retrieveUserPosts(user.id)

        expect(posts).to.be.an('Array').that.has.lengthOf(3)
        expect(posts[0].text.toString()).to.be.equal(post1.text.toString())
        expect(posts[1].text.toString()).to.be.equal(post2.text.toString())
        expect(posts[2].text.toString()).to.be.equal(post3.text.toString())
    })

    // NEGATIVE CASE - Invalid user ID format
    it('Failure with invalid user ID', async () => {
        const userId = random.name()

        try {
            await retrieveUserPosts(userId)
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
            await retrieveUserPosts(userId.toString())
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found. Try again')
        }
    })

    // NEGATIVE CASE - Posts not found
    it('Failure on posts not found', async () => {
        const user = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })

        try {
            await retrieveUserPosts(user.id)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('No posts created yet!')
        }
    })

    after(() => mongoose.disconnect())
})

