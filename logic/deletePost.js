import { User, Post } from '../data/models.js'
import validator from 'validator'
import errors from '../utils/errors.js'
const { SystemError, NotFoundError, ContentError, AuthorizationError } = errors

export default async function deletePost(userId, postId) {
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

        if (post.user.toString() !== userId) {
            throw new AuthorizationError('Denied! You are not the owner of this post')
        }

        await Post.deleteOne({ _id: postId })
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof ContentError || error instanceof AuthorizationError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}