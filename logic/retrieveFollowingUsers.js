import { User, Follow } from '../data/models.js'
import validator from 'validator'
import errors from '../utils/errors.js'
const { SystemError, NotFoundError, ContentError } = errors

export default async function retrieveFollowingUsers(userId) {
    try {
        const validateId = validator.isMongoId(userId)

        if (!validateId) {
            throw new ContentError('Invalid ID user. Try again')
        }

        const user = await User.findById(userId).lean()

        if (!user) {
            throw new NotFoundError('User not found. Please, check it again')
        }

        const followingList = await Follow.find({ user: userId }).lean()

        if (!followingList || followingList.length === 0) {
            throw new NotFoundError('There is no following any users yet...')
        }

        const list = followingList.map(user => user.followed.toString())
        return list

    } catch (error) {
        if (error instanceof ContentError || error instanceof NotFoundError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}