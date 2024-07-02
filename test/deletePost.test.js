import mongoose from 'mongoose'
import dotenv from 'dotenv'
import deletePost from '../logic/deletePost.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_API_SOCIALMEDIA)
    .then(() => {
        try {
            deletePost('667c37a3278737a950296d69', '667c3785278737a950296d66')
                .then(() => console.log('Post succesfully deleted!'))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))