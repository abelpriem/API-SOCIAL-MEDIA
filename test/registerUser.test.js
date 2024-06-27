import mongoose from 'mongoose'
import dotenv from 'dotenv'
import registerUser from '../logic/registerUser.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_API_SOCIALMEDIA)
    .then(() => {
        try {
            registerUser('Buzz', 'Lightyear', 'Buzzie999', 'buzzlightyear@email.com', '123123123')
                .then(user => console.log('User succesfully registered!', user))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))