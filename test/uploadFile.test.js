import mongoose from 'mongoose'
import dotenv from 'dotenv'
import uploadFile from '../logic/uploadFile.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_API_SOCIALMEDIA)
    .then(() => {
        try {
            uploadFile('667c37a3278737a950296d69', 'Hi there!', 'avatar.png', './uploads/avatar/image.png', 'image/png')
                .then(userUpdated => console.log('File succesfully uploaded!', userUpdated))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))