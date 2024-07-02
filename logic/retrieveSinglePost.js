import { Post, User } from '../data/models.js'
import validator from 'validator'
import errors from '../utils/errors.js'
const { SystemError, NotFoundError, ContentError } = errors

export default async function retrieveSinglePost(userId, postId) {
    try {
        const validateUserId = validator.isMongoId(userId)
        const validatePostId = validator.isMongoId(postId)

        if (!validateUserId) {
            throw new ContentError('Invalid ID user. Try again')
        }

        if (!validatePostId) {
            throw new ContentError('Invalid ID post. Try again')
        }

        const user = await User.findById(userId).lean()

        if (!user) {
            throw new NotFoundError('User not found. Try again')
        }

        const post = await Post.findById(postId).lean()

        if (!post) {
            throw new NotFoundError('Post not found. Try again')
        }

        return post
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof ContentError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}