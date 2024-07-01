import mongoose from 'mongoose'
import multer from 'multer'
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import {
    authenticateUserHandler,
    changeUserPasswordHandler,
    changeUserEmailHandler,
    registerUserHandler,
    retrieveUserHandler,
    retrieveUserAvatarHandler,
    retrievePageUserHandler,
    uploadFileHandler
} from './handlers/index.js'

dotenv.config()

// SERVER CONECTION
mongoose.connect(process.env.URL_MONGODB_API_SOCIALMEDIA)
    .then(() => {
        // SERVER
        const server = express()
        const jasonBodyParser = express.json()

        // MULTER - OPTION CONFIGURATION
        // const finalStorage = multer.diskStorage({
        //     destination: (req, file, cb) => {
        //         cb(null, './uploads/avatars/')
        //     },
        //     filename: (req, file, cb) => {
        //         cb(null, 'article' + Date.now() + file.originalname)
        //     }
        // })

        const uploads = multer({ dest: 'uploads/avatars' })

        server.use(cors())

        // ROUTE - REGISTER USER
        server.post('/api/users', jasonBodyParser, registerUserHandler)

        // ROUTE - LOGIN USER
        server.post('/api/users/auth', jasonBodyParser, authenticateUserHandler)

        // ROUTE - RETRIEVE USER
        server.get('/api/users/:id', retrieveUserHandler)

        // ROUTE - LIST USERS
        server.get('/api/users/list/:page?', retrievePageUserHandler)

        // ROUTE - UPDATE USER PASSWORD
        server.put('/api/users/update/password', jasonBodyParser, changeUserPasswordHandler)

        // ROUTE - UPDATE USER EMAIL
        server.put('/api/users/update/email', jasonBodyParser, changeUserEmailHandler)

        // ROUTE - UPLOAD AVATAR IMAGE
        server.post('/api/users/upload', uploads.single('file'), uploadFileHandler)

        // ROUTE - GET AVATAR
        server.get('/api/users/avatar/:name', retrieveUserAvatarHandler)

        // CONNECTION
        server.listen(process.env.PORT, () => console.log(`Server Online! Listening on: ${process.env.PORT}`))
    })
    .catch(error => console.log(error))
