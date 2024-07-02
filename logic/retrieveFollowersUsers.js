import { User, Follow } from '../data/models.js'
import validator from 'validator'
import errors from '../utils/errors.js'
const { SystemError, NotFoundError, ContentError } = errors

export default async function retrieveFollowersUser(userId) {
    try {
        const validateId = validator.isMongoId(userId)

        if (!validateId) {
            throw new ContentError('Invalid ID user. Try again')
        }

        const user = await User.findById(userId).lean()

        if (!user) {
            throw new NotFoundError('User not found. Please, check it again')
        }

        const followersList = await Follow.find({ followed: userId }).lean()

        if (!followersList || followersList.length === 0) {
            throw new NotFoundError('Nobody follows you yet!')
        }

        const list = followersList.map(follower => follower.user.toString())
        return list

    } catch (error) {
        if (error instanceof ContentError || error instanceof NotFoundError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}