import mongoose from 'mongoose'
import dotenv from 'dotenv'
import retrievePageUser from '../logic/retrievePageUser.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_API_SOCIALMEDIA)
    .then(() => {
        let page = 2

        try {
            retrievePageUser('667c3785278737a950296d66', page)
                .then(result => console.log(`List of BD users on page ${page}!`, 'Total users: ' + result.total, result.users))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))