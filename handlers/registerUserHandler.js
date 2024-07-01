import registerUser from '../logic/registerUser.js'
import errors from '../utils/errors.js'
const { ContentError } = errors

export default async (req, res) => {
    const { name, surname, username, email, password } = req.body

    try {
        const user = await registerUser(name, surname, username, email, password)
        res.status(201).json({ success: 'true', message: 'User succesfully registered!', user: user })
    } catch (error) {
        let status = 500

        if (error instanceof ContentError || error instanceof TypeError) {
            status = 409
        }

        res.status(status).json({ error: error.constructor.name, message: error.message })
    }
}