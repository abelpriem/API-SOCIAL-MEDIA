import fs from 'fs/promises'
import validator from 'validator'
import { User, Post } from '../data/models.js'
import errors from '../utils/errors.js'
const { SystemError, NotFoundError, ContentError, DuplicityError } = errors

export default async function savePost(userId, text, fileName, filePath, fileType) {
    try {
        const validateId = validator.isMongoId(userId)
        const validateText = !validator.isEmpty(text)

        if (!validateId) {
            throw new ContentError('Invalid ID user. Try again')
        } else if (!validateText) {
            throw new ContentError('Text field is empty. Check it again')
        }

        const user = await User.findById(userId).lean()

        if (!user) {
            throw new NotFoundError('User not found. Try again')
        }

        let newPost = ''

        if (fileName === undefined || filePath === undefined || fileType === undefined) {
            newPost = await Post.create({ user: userId, text: text })
        } else {
            if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
                await fs.unlink(filePath)
                throw new ContentError('Invalid image format. Please, try only with png or jpeg extension')
            }

            newPost = await Post.create({ user: userId, text: text, file: fileName })
            await fs.rename(filePath, `./uploads/posts/${fileName}`)
        }

        return newPost
    } catch (error) {
        if (error.code === 11000) {
            throw new DuplicityError('Post has already been created!')
        }

        if (error instanceof NotFoundError || error instanceof ContentError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}