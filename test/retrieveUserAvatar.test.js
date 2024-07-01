import mongoose from 'mongoose'
import path from 'path'
import retrieveUserAvatar from '../logic/retrieveUserAvatar.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_API_SOCIALMEDIA)
    .then(() => {
        try {
            retrieveUserAvatar('id', 'fileName')
                .then(filePath => res.sendFile(filePath))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))