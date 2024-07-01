import mongoose from 'mongoose'
import dotenv from 'dotenv'
import changeUserEmail from '../logic/changeUserEmail.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_API_SOCIALMEDIA)
    .then(() => {
        try {
            changeUserEmail('667c37a3278737a950296d69', 'woodywestern@email.com')
                .then(() => console.log('Email succesfully changed!'))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))