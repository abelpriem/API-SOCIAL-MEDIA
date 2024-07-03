import mongoose from 'mongoose'
import dotenv from 'dotenv'
import random from './helpers/random.js'
import errors from '../utils/errors.js'
import deletePost from '../logic/deletePost.js'
import { User, Post } from '../data/models.js'
import { expect } from 'chai'
const { NotFoundError, ContentError, AuthorizationError } = errors

dotenv.config()

describe('deletePost', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())
    beforeEach(() => Post.deleteMany())

    // POSITIVE CASE
    it('Success on delete a post', async () => {
        const user = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const post = await Post.create({ user: user.id, text: random.text(), created_at: Date.now() })

        await deletePost(user.id, post.id)

        const checkPost = await Post.findById(post.id).lean()

        expect(checkPost).to.be.null
    })

    // NEGATIVE CASE - Invalid user ID format
    it('Failure with invalid user ID', async () => {
        const userId = random.name()
        const postId = random.id()

        try {
            await deletePost(userId, postId.toString())
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
            await deletePost(userId.toString(), postId)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Invalid ID post. Try again')
        }
    })

    // NEGATIVE CASE - User not found
    it('Failure on user not found', async () => {
        const userId = random.id()
        const post = random.id()

        try {
            await deletePost(userId.toString(), post.toString())
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found. Try again')
        }
    })

    // NEGATIVE CASE - Post not found
    it('Failure on followed not found', async () => {
        const user = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const post = random.id()

        try {
            await deletePost(user.id, post.toString())
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('Post not found. Try again')
        }
    })

    // NEGATIVE CASE - Authorization error
    it('Failure when deleting a post without being the owner', async () => {
        const user1 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const user2 = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })

        const post = await Post.create({ user: user1.id, text: random.text(), created_at: Date.now() })

        try {
            await deletePost(user2.id, post.id)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(AuthorizationError)
            expect(error.message).to.be.equal('Denied! You are not the owner of this post')
        }
    })

    after(() => mongoose.disconnect())
})