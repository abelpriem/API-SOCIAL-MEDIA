import mongoose from 'mongoose'
import dotenv from 'dotenv'
import retrieveUser from '../logic/retrieveUser.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_API_SOCIALMEDIA)
    .then(() => {
        try {
            retrieveUser('667c3785278737a950296d66', '667c376c25440d0ac49bb0b6')
                .then(result => console.log('User retrieved!', result))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))