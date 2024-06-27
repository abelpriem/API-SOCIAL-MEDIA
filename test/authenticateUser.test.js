import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authenticateUser from '../logic/authenticateUser.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_API_SOCIALMEDIA)
    .then(() => {
        try {
            authenticateUser('buzzlightyear@email.com', '123123123')
                .then(user => console.log('Logged! Welcome ' + user.username + ' - { id: ' + user.id.toString() + ' }'))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))