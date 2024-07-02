import mongoose from 'mongoose'
import dotenv from 'dotenv'
import retrieveUserPosts from '../logic/retrieveUserPosts.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_API_SOCIALMEDIA)
    .then(() => {
        try {
            retrieveUserPosts('667c37bd278737a950296d6c')
                .then(posts => console.log('Retrieve all user posts succesfully!', posts))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))