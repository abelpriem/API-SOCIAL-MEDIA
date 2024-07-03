import mongoose from 'mongoose'
import dotenv from 'dotenv'
import errors from '../utils/errors.js'
import fs from 'fs/promises'
import random from './helpers/random.js'
import retrieveUserAvatar from '../logic/retrieveUserAvatar.js'
import { expect } from 'chai'
import { User } from '../data/models.js'
const { NotFoundError, ContentError } = errors

dotenv.config()

describe('retrieveUserAvatar', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())

    // POSITIVE CASE
    it('Success on retrieve user avatar', async () => {
        const fileName = `avatar-test-${Math.random()}.jpg`
        await fs.writeFile(`./uploads/avatars/${fileName}`, 'jpg')

        const user = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password(), image: fileName })
        const filePath = await retrieveUserAvatar(user.id, fileName)

        let fileExist = true

        try {
            await fs.access(filePath)
        } catch (error) {
            fileExist = false
        }

        expect(filePath).to.be.exist
        expect(user.image).to.be.equal(fileName)
    })

    // NEGATIVE CASE - Invalid user ID format
    it('Failure with invalid user ID', async () => {
        const userId = random.name()
        const fileName = random.text()

        try {
            await retrieveUserAvatar(userId, fileName)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Invalid ID user. Try again')
        }
    })


    // NEGATIVE CASE - User not found
    it('Failure on user not found', async () => {
        const userId = random.id()
        const fileName = random.text()

        try {
            await retrieveUserAvatar(userId.toString(), fileName)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found. Please, try again')
        }
    })

    // NEGATIVE CASE - Avatar not found
    it('Failure on post not found', async () => {
        const fileName = `avatar-test-${Math.random()}.jpg`
        const wrongFileName = `avatar-test-${Math.random()}.jpg`
        await fs.writeFile(`./uploads/avatars/${fileName}`, 'jpg')

        const user = await User.create({ name: random.name(), surname: random.surname(), username: random.username(), email: random.email(), password: random.password(), image: fileName })

        try {
            await retrieveUserAvatar(user.id, wrongFileName)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('Avatar/image not found. Please, check the name or the path')
        }
    })

    after(() => mongoose.disconnect())
})

