import mongoose from 'mongoose'
import dotenv from 'dotenv'
import retrieveFollowersUsers from '../logic/retrieveFollowersUsers.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_API_SOCIALMEDIA)
    .then(() => {
        try {
            retrieveFollowersUsers('667c376c25440d0ac49bb0b6')
                .then(users => console.log('This is your current followers: ', users))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))