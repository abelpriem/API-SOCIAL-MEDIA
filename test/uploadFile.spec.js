import mongoose from 'mongoose'
import dotenv from 'dotenv'
import fs from 'fs/promises'
import random from './helpers/random.js'
import uploadFile from '../logic/uploadFile.js'
import errors from '../utils/errors.js'
import { User } from '../data/models.js'
import { expect, use } from 'chai'
const { NotFoundError, ContentError } = errors

dotenv.config()

describe('uploadFile', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())

    // POSITIVE CASE
    it('Success on upload a file', async () => {
        const fileName = `uploadAvatar-test-${Math.random}.png`
        const filePath = './uploads/avatars/test.png'
        const fileType = 'image/png'

        await fs.writeFile(filePath, 'png')

        const user = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const userUpdated = await uploadFile(user.id, fileName, filePath, fileType)

        let fileExist = true

        try {
            await fs.access(filePath)
        } catch (error) {
            fileExist = false
        }

        expect(userUpdated).to.be.an('Object')
        expect(userUpdated.image).to.be.equal(fileName)
        expect(fileExist).to.be.false
    })

    // NEGATIVE CASE - Invalid user ID format
    it('Failure with invalid user ID', async () => {
        const userId = random.name()
        const fileName = random.text()
        const filePath = random.text()
        const fileType = random.text()

        try {
            await uploadFile(userId, fileName, filePath, fileType)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Invalid ID user. Try again')
        }
    })

    // NEGATIVE CASE - Empty field name
    it('Failure with empty field name', async () => {
        const userId = random.id()
        const fileName = ''
        const filePath = random.text()
        const fileType = random.text()

        try {
            await uploadFile(userId.toString(), fileName, filePath, fileType)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Warning! Avatar image is empty or something happened...')
        }
    })

    // NEGATIVE CASE - Empty field path
    it('Failure with empty field path', async () => {
        const userId = random.id()
        const fileName = random.text()
        const filePath = ''
        const fileType = random.text()

        try {
            await uploadFile(userId.toString(), fileName, filePath, fileType)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Warning! Avatar image is empty or something happened...')
        }
    })

    // NEGATIVE CASE - Empty field type
    it('Failure with empty field type', async () => {
        const userId = random.id()
        const fileName = random.text()
        const filePath = random.text()
        const fileType = ''

        try {
            await uploadFile(userId.toString(), fileName, filePath, fileType)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Warning! Avatar image is empty or something happened...')
        }
    })

    // NEGATIVE CASE - Invalid image format
    it('Failure with invalid image format', async () => {
        const fileName = `uploadAvatar-test-${Math.random}.mkv`
        const filePath = './uploads/avatars/test.mkv'
        const fileType = 'video/mkv'

        await fs.writeFile(filePath, 'mkv')

        const user = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })

        try {
            await uploadFile(user.id, fileName, filePath, fileType)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Invalid image format. Please, try only with png or jpeg extension')
        }
    })

    // NEGATIVE CASE - User not found
    it('Failure on user not found', async () => {
        const userId = random.id()
        const fileName = `uploadAvatar-test-${Math.random}.jpeg`
        const filePath = './uploads/avatars/test.jpeg'
        const fileType = 'image/jpeg'

        await fs.writeFile(filePath, 'jpeg')

        try {
            await uploadFile(userId.toString(), fileName, filePath, fileType)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found. Try again')
        }
    })

    after(() => mongoose.disconnect())
})