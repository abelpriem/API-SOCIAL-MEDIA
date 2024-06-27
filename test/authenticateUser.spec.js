import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import errors from '../utils/errors.js'
import random from './helpers/random.js'
import authenticateUser from '../logic/authenticateUser.js'
import { User } from '../data/models.js'
import { expect } from 'chai'
const { NotFoundError, ContentError, CredentialsError } = errors

dotenv.config()

describe('authenticateUser', () => {
    before(() => mongoose.connect(process.env.URL_MONDODB_TEST))

    beforeEach(() => User.deleteMany())

    // POSITIVE CASE
    it('succes on authenticate with existing user', async () => {
        const name = random.name()
        const surname = random.surname()
        const username = random.username()
        const email = random.email()
        const password = random.password()

        const hash = await bcrypt.hash(password, 5)
        const user = await User.create({ name, surname, username, email, password: hash })

        const userLogged = await authenticateUser(email, password)

        expect(userLogged).to.be.exist
        expect(userLogged.id.toString()).to.be.equal(user._id.toString())
        expect(userLogged.username).to.be.equal(user.username)
    })

    // NEGATIVE CASE - User not found
    it('fails on user not found', async () => {
        const email = random.email()
        const password = random.password()

        try {
            await authenticateUser(email, password)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found. Try it again')
        }
    })

    // NEGATIVE CASE - Wrong credentials
    it('fails on login user with wrong credentials', async () => {
        const name = random.name()
        const surname = random.surname()
        const username = random.username()
        const email = random.email()
        const password = random.password()
        const wrongPassword = random.password()

        const hash = await bcrypt.hash(password, 5)
        await User.create({ name, surname, username, email, password: hash })

        try {
            await authenticateUser(email, wrongPassword)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(CredentialsError)
            expect(error.message).to.be.equal('Wrong credentials... Try again')
        }
    })

    // NEGATIVE CASE - Empty email field
    it('fails on login user with empty email field', async () => {
        const email = random.email()

        try {
            await authenticateUser(email, '')
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Some values are empty... Please, try it again')
        }
    })

    // NEGATIVE CASE - Empty password field
    it('fails on login user with empty password field', async () => {
        const password = random.password()

        try {
            await authenticateUser('', password)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Some values are empty... Please, try it again')
        }
    })

    // NEGATIVE CASE - Incorrect email format
    it('fails on incorrect email format', async () => {
        const email = `email-${Math.random()}`
        const password = random.password()

        try {
            await authenticateUser(email, password)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Email format is not valid. Try it again')
        }
    })

    after(() => mongoose.disconnect())
})
