import mongoose from 'mongoose'
import dotenv from 'dotenv'
import random from './helpers/random.js'
import fs from 'fs/promises'
import errors from '../utils/errors.js'
import savePost from '../logic/savePost.js'
import { User, Post } from '../data/models.js'
import { expect } from 'chai'
const { NotFoundError, ContentError, AuthorizationError } = errors

dotenv.config()

describe('savePost', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())
    beforeEach(() => Post.deleteMany())

    // POSITIVE CASE
    it('Success on saving a post', async () => {

        const text = random.text()
        const fileName = `file-test-${Math.random()}.png`
        const filePath = './uploads/posts/image.png'
        const fileType = 'image/png'

        await fs.writeFile(filePath, 'png')

        const user = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })
        const post = await savePost(user.id, text, fileName, filePath, fileType)

        let fileExist = true

        try {
            await fs.access(filePath)
        } catch (error) {
            fileExist = false
        }

        expect(post).to.be.an('Object')
        expect(post.user.toString()).to.be.equal(user.id)
        expect(post.text).to.be.equal(text)
        expect(post.file).to.be.equal(fileName)
        expect(fileExist).to.be.false
    })

    // NEGATIVE CASE - Invalid user ID format
    it('Failure with invalid user ID', async () => {
        const userId = random.name()
        const text = ''

        try {
            await savePost(userId, text)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Invalid ID user. Try again')
        }
    })

    // NEGATIVE CASE - Empty text field
    it('Failure with empty text field', async () => {
        const userId = random.id()
        const text = ''

        try {
            await savePost(userId.toString(), text)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Text field is empty. Check it again')
        }
    })

    // NEGATIVE CASE - User not found
    it('Failure on user not found', async () => {
        const userId = random.id()
        const text = random.text()

        try {
            await savePost(userId.toString(), text)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found. Try again')
        }
    })

    // NEGATIVE CASE - Invalid image format
    it('Failure with invalid image format', async () => {

        const text = random.text()
        const fileName = `file-test-${Math.random()}.mkv`
        const filePath = './uploads/posts/video-test.mkv'
        const fileType = 'video/mkv'

        await fs.writeFile(filePath, 'mkv')

        const user = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password() })

        try {
            await savePost(user.id, text, fileName, filePath, fileType)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Invalid image format. Please, try only with png or jpeg extension')
        }
    })

    after(() => mongoose.disconnect())
})