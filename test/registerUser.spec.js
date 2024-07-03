import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import errors from '../utils/errors.js'
import random from './helpers/random.js'
import registerUser from '../logic/registerUser.js'
import { User } from '../data/models.js'
import { expect } from 'chai'
const { ContentError, DuplicityError } = errors

dotenv.config()

describe('registerUser', async () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())

    // POSITIVE CASE
    it('Success on register user', async () => {
        const name = random.name()
        const surname = random.surname()
        const username = random.username()
        const email = random.email()
        const password = random.password()

        const user = await registerUser(name, surname, username, email, password)
        const checkUser = await User.findById(user._id).lean()

        const match = await bcrypt.compare(password, checkUser.password)

        expect(user).to.be.an('Object')
        expect(user.name).to.be.equal(name)
        expect(user.surname).to.be.equal(surname)
        expect(user.username).to.be.equal(username)
        expect(user.email).to.be.equal(email)
        expect(match).to.be.true
    })

    // NEGATIVE CASE - Empty name
    it('Failure on register user with an empty name', async () => {
        const name = ''
        const surname = random.surname()
        const username = random.username()
        const email = random.email()
        const password = random.password()

        try {
            await registerUser(name, surname, username, email, password)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Some values are empty... Please, try it again')
        }
    })

    // NEGATIVE CASE - Empty surname
    it('Failure on register user with an empty surname', async () => {
        const name = random.name()
        const surname = ''
        const username = random.username()
        const email = random.email()
        const password = random.password()

        try {
            await registerUser(name, surname, username, email, password)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Some values are empty... Please, try it again')
        }
    })

    // NEGATIVE CASE - Empty username
    it('Failure on register user with an empty username', async () => {
        const name = random.name()
        const surname = random.surname()
        const username = ''
        const email = random.email()
        const password = random.password()

        try {
            await registerUser(name, surname, username, email, password)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Some values are empty... Please, try it again')
        }
    })

    // NEGATIVE CASE - Empty email
    it('Failure on register user with an empty email', async () => {
        const name = random.name()
        const surname = random.surname()
        const username = random.username()
        const email = ''
        const password = random.password()

        try {
            await registerUser(name, surname, username, email, password)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Some values are empty... Please, try it again')
        }
    })

    // NEGATIVE CASE - Empty password
    it('Failure on register user with an empty password', async () => {
        const name = random.name()
        const surname = random.surname()
        const username = random.username()
        const email = random.email()
        const password = ''

        try {
            await registerUser(name, surname, username, email, password)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Some values are empty... Please, try it again')
        }
    })

    // NEGATIVE CASE - Wrong email format
    it('Failure on register user with wrong email format', async () => {
        const name = random.name()
        const surname = random.surname()
        const username = random.username()
        const email = `email-${Math.random()}`
        const password = random.email()

        try {
            await registerUser(name, surname, username, email, password)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Email format is not valid. Try it again')
        }
    })

    // NEGATIVE CASE - Password with less on 8 character
    it('Failure on register user with password with less on 8 character', async () => {
        const name = random.name()
        const surname = random.surname()
        const username = random.username()
        const email = random.email()
        const password = '1234'

        try {
            await registerUser(name, surname, username, email, password)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.be.equal('Password must have 8 characters! Try it again')
        }
    })

    // NEGATIVE CASE - Duplicate registered user
    it('Failure on register an existing already user', async () => {
        const name = random.name()
        const surname = random.surname()
        const username = random.username()
        const email = random.email()
        const password = random.password()

        const hash = await bcrypt.hash(password, 5)

        await User.create({ name: name, surname: surname, username: username, email: email, password: hash })

        try {
            await registerUser(name, surname, username, email, password)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(DuplicityError)
            expect(error.message).to.be.equal('User already exist! Please, try it again')
        }
    })

    after(() => mongoose.disconnect())
})

