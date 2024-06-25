import mongoose from 'mongoose'
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import {
    registerUserHandler,
    authenticateUserHandler
} from './handlers/index.js'

dotenv.config()

// SERVER CONECTION
mongoose.connect(process.env.URL_MONGODB_API_SOCIALMEDIA)
    .then(() => {
        // SERVER
        const server = express()
        const jasonBodyParser = express.json()

        server.use(cors())

        // ROUTE - REGISTER USER
        server.post('/api/users', jasonBodyParser, registerUserHandler)

        // ROUTE - AUTHENTICATE USER
        server.post('/api/users/auth', jasonBodyParser, authenticateUserHandler)

        // CONNECTION
        server.listen(process.env.PORT, () => console.log(`Server Online! Listening on: ${process.env.PORT}`))
    })
    .catch(error => console.log(error))
