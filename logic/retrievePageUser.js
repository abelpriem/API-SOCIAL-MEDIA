import mongoosePagination from 'mongoose-pagination'
import { User } from '../data/models.js'
import errors from '../utils/errors.js'
import validator from 'validator'
const { SystemError, NotFoundError, ContentError } = errors

export default async function retrievePageUser(userId, page) {
    const validateId = validator.isMongoId(userId)

    if (!validateId) {
        throw new ContentError('Invalid ID user... Try it again')
    }

    try {
        let itemsPerPage = 2
        const user = await User.findById(userId).lean()

        if (!user) {
            throw new NotFoundError('User not found. Try again')
        }

        const listUsers = await User.find().sort('_id').select({ password: 0, role: 0 }).paginate(page, itemsPerPage)
        const totalUsers = await User.countDocuments({})

        if (listUsers.length === 0) {
            throw new NotFoundError('There are no users on that page yet!')
        }

        return { users: listUsers, total: totalUsers }
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof ContentError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}