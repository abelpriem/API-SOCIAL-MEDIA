import { Post, User } from '../data/models.js'
import validator from 'validator'
import errors from '../utils/errors.js'
const { SystemError, NotFoundError, ContentError } = errors

export default async function retrieveUserPosts(userId) {
    try {
        const validateId = validator.isMongoId(userId)

        if (!validateId) {
            throw new ContentError('Invalid ID user. Try again')
        }

        const user = await User.findById(userId).lean()

        if (!user) {
            throw new NotFoundError('User not found. Try again')
        }

        const posts = await Post.find({ "user": userId }).lean()

        if (!posts || posts.length === 0) {
            throw new NotFoundError('No posts created yet!')
        }

        return posts
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof ContentError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}