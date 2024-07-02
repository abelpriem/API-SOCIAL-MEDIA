import { User, Follow } from '../data/models.js'
import validator from 'validator'
import errors from '../utils/errors.js'
const { SystemError, NotFoundError, ContentError } = errors

export default async function deleteFollow(userId, followedId) {
    try {
        const validateId = validator.isMongoId(userId)
        const validateFollowedId = validator.isMongoId(followedId)

        if (!validateId || !validateFollowedId) {
            throw new ContentError('Invalid ID user... Try again')
        }

        const user = await User.findById(userId).lean()

        if (!user) {
            throw new NotFoundError('User not found... Try again')
        }

        const userFollowed = await User.findById(followedId).lean()

        if (!userFollowed) {
            throw new NotFoundError('User followed not found... Try again')
        }

        const followDeleted = await Follow.findOneAndDelete({ "user": userId, "followed": followedId })

        if (!followDeleted) {
            throw new NotFoundError('You havent stopped following anyone!')
        }

    } catch (error) {
        if (error instanceof NotFoundError || error instanceof ContentError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}