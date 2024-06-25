import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authenticateUser from '../logic/authenticateUser.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_API_SOCIALMEDIA)
    .then(() => {
        try {
            authenticateUser('abelprieto@email.com', '123123123')
                .then(userId => console.log('User succesfully logged! Welcome ' + '- id: ' + userId.toString()))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))