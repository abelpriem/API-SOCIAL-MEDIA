import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import errors from '../utils/errors.js'
import random from './helpers/random.js'
import { User } from '../data/models.js'
import { expect } from 'chai'
const { ContentError, DuplicityError } = errors

dotenv.config()

describe('registerUser', async () => {
    before(() => mongoose.connect(process.env.URL_MONDODB_TEST))

    beforeEach(() => User.deleteMany())

    // POSITIVE CASE
    it('success on register user', async () => {
        const name = random.name()
        const surname = random.surname()
        const username = random.username()
        const email = random.email()
        const password = random.password()

        const hash = await bcrypt.hash(password, 5)
        const user = await User.create({ name, surname, username, email, password: hash })

        expect(user).to.be.an(Object)
        expect(user.name).to.be.equal(name)
        expect(user.surname).to.be.equal(surname)
        expect(user.username).to.be.equal(username)
        expect(user.email).to.be.equal(email)
        expect(user.password).to.be.equal(hash)
    })

    after(() => mongoose.disconnect())
})

