import mongoose from 'mongoose'
import dotenv from 'dotenv'
import deleteFollow from '../logic/deleteFollow.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_API_SOCIALMEDIA)
    .then(() => {
        try {
            deleteFollow('667c37a3278737a950296d69', '667c3785278737a950296d66')
                .then(() => console.log('Follow succesfully deleted!'))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))