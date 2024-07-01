import mongoose from 'mongoose'
import dotenv from 'dotenv'
import changeUserPassword from '../logic/changeUserPassword.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_API_SOCIALMEDIA)
    .then(() => {
        try {
            changeUserPassword('667c37a3278737a950296d69', '123123123')
                .then(() => console.log('Password succesfully changed!'))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))