import mongoose from 'mongoose'
import dotenv from 'dotenv'
import savePost from '../logic/savePost.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_API_SOCIALMEDIA)
    .then(() => {
        try {
            savePost('667c37a3278737a950296d69', 'testing post')
                .then(newPost => console.log('Post succesfully created!', newPost))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))