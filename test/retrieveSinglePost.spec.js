import mongoose from 'mongoose'
import dotenv from 'dotenv'
import errors from '../utils/errors.js'
import random from './helpers/random.js'
import retrieveSinglePost from '../logic/retrieveSinglePost.js'
import { expect } from 'chai'
import { User, Post } from '../data/models.js'
const { NotFoundError, ContentError } = errors

dotenv.config()

describe('retrieveSinglePost', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())
    beforeEach(() => Post.deleteMany())

    // POSITIVE CASE
    it('Success on retrieve a single post', async () => {
        const user = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })

        const post1 = await Post.create({ user: user.id, text: random.text(), created_at: Date.now() })
        const post2 = await Post.create({ user: user.id, text: random.text(), created_at: Date.now() })

        const singlePost = await retrieveSinglePost(user.id, post2.id)

        expect(singlePost).to.be.an('Object')
        expect(singlePost.text).to.be.equal(post2.text)
        expect(singlePost.text).not.to.be.equal(post1.text)
    })

    // NEGATIVE CASE - Invalid user ID format
    it('Failure with invalid user ID', async () => {
        const userId = random.name()
        const postId = random.id()

        try {
            await retrieveSinglePost(userId, postId.toString())
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Invalid ID user. Try again')
        }
    })

    // NEGATIVE CASE - Invalid post ID format
    it('Failure with invalid post ID', async () => {
        const userId = random.id()
        const postId = random.name()

        try {
            await retrieveSinglePost(userId.toString(), postId)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Invalid ID post. Try again')
        }
    })

    // NEGATIVE CASE - User not found
    it('Failure on user not found', async () => {
        const userId = random.id()
        const postId = random.id()

        try {
            await retrieveSinglePost(userId.toString(), postId.toString())
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found. Try again')
        }
    })

    // NEGATIVE CASE - Post not found
    it('Failure on post not found', async () => {
        const user = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const postId = random.id()

        try {
            await retrieveSinglePost(user.id, postId.toString())
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('Post not found. Try again')
        }
    })

    after(() => mongoose.disconnect())
})

