import { User } from '../data/models.js'
import validator from 'validator'
import errors from '../utils/errors.js'
const { SystemError, NotFoundError, ContentError } = errors

export default async function retrieveUser(userId, userIdToSearch) {
    const validateIdUser = validator.isMongoId(userId)
    const validateIdUserToSearch = validator.isMongoId(userIdToSearch)

    try {
        if (!validateIdUser || !validateIdUserToSearch) {
            throw new ContentError('Fails on ID format. Check it again')
        }

        const userLogged = await User.findById(userId).lean()

        if (!userLogged) {
            throw new NotFoundError('Request user not found. Please, login again')
        }

        const userToFind = await User.findById(userIdToSearch).lean()

        if (!userToFind) {
            throw new NotFoundError('User not found. Try it again')
        }

        return {
            name: userToFind.name,
            surname: userToFind.surname,
            nick: userToFind.username,
            image: userToFind.image
        }
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof ContentError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}