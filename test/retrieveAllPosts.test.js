import mongoose from 'mongoose'
import dotenv from 'dotenv'
import retrieveAllPosts from '../logic/retrieveAllPosts.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_API_SOCIALMEDIA)
    .then(() => {
        try {
            retrieveAllPosts('667c37a3278737a950296d69')
                .then(posts => console.log('Retrieve all created posts succesfully!', posts))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))