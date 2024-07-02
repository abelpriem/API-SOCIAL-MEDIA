import mongoose from 'mongoose'
import dotenv from 'dotenv'
import retrieveFollowingUsers from '../logic/retrieveFollowingUsers.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_API_SOCIALMEDIA)
    .then(() => {
        try {
            retrieveFollowingUsers('667c3785278737a950296d66')
                .then(users => console.log('List of following users: ', users))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))