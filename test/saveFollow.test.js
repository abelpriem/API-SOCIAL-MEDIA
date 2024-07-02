import mongoose from 'mongoose'
import dotenv from 'dotenv'
import saveFollow from '../logic/saveFollow.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_API_SOCIALMEDIA)
    .then(() => {
        try {
            saveFollow('667c3785278737a950296d66', '667c376c25440d0ac49bb0b6')
                .then(follow => console.log('User succesfully followed!', follow))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))