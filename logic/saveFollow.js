import { User, Follow } from '../data/models.js'
import errors from '../utils/errors.js'
import validator from 'validator'
const { SystemError, NotFoundError, ContentError, DuplicityError } = errors

export default async function saveFollow(userId, userToFollow) {
    try {
        const validateIdAuthenticate = validator.isMongoId(userId)
        const validateIdToFollow = validator.isMongoId(userToFollow)

        if (!validateIdAuthenticate || !validateIdToFollow) {
            throw new ContentError('Invalid ID user... Try again')
        }

        const userAuth = await User.findById(userId).lean()

        if (!userAuth) {
            throw new NotFoundError('User not found. Try again')
        }

        const userFollowed = await User.findById(userToFollow).lean()

        if (!userFollowed) {
            throw new NotFoundError('The user to follow cannot be found. Please try again')
        }

        const checkFollow = await Follow.findOne({ "user": userId, "followed": userToFollow }).lean()

        if (checkFollow) {
            throw new DuplicityError('You already followed the user! Check it again')
        } else {
            const follow = await Follow.create({ user: userAuth._id, followed: userFollowed._id })

            return follow
        }

    } catch (error) {
        if (error instanceof NotFoundError || error instanceof ContentError || error instanceof DuplicityError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}