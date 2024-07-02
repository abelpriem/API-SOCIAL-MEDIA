import mongoose from 'mongoose'
import dotenv from 'dotenv'
import retrieveSinglePost from '../logic/retrieveSinglePost.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_API_SOCIALMEDIA)
    .then(() => {
        try {
            retrieveSinglePost('667c3785278737a950296d66', '66830c82da95b2cef4d5df71')
                .then(post => console.log('Post succesfully retieved!', post))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))