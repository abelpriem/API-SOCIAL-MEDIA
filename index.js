import mongoose from 'mongoose'
import multer from 'multer'
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import {
    authenticateUserHandler,
    changeUserPasswordHandler,
    changeUserEmailHandler,
    deleteFollowHandler,
    deletePostHandler,
    registerUserHandler,
    retrieveAllPostsHandler,
    retrieveFollowingUsersHandler,
    retrieveFollowersUsersHandler,
    retrieveUserHandler,
    retrieveUserAvatarHandler,
    retrieveUserPostsHandler,
    retrievePageUserHandler,
    retrieveSinglePostHandler,
    saveFollowHandler,
    savePostHandler,
    uploadFileHandler,
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
        //         cb(null, 'avatar' + Date.now() + file.originalname)
        //     }
        // })

        // MULTER - STORAGE AVATAR CONFIGURATION
        const uploadAvatar = multer({ dest: 'uploads/avatars' })
        const uploadPost = multer({ dest: 'uploads/posts' })

        server.use(cors())

        // ROUTE - REGISTER USER
        server.post('/api/user', jasonBodyParser, registerUserHandler)

        // ROUTE - LOGIN USER
        server.post('/api/user/auth', jasonBodyParser, authenticateUserHandler)

        // ROUTE - RETRIEVE USER
        server.get('/api/user/:id', retrieveUserHandler)

        // ROUTE - LIST USERS
        server.get('/api/user/list/:page?', retrievePageUserHandler)

        // ROUTE - UPDATE USER PASSWORD
        server.put('/api/user/update/password', jasonBodyParser, changeUserPasswordHandler)

        // ROUTE - UPDATE USER EMAIL
        server.put('/api/user/update/email', jasonBodyParser, changeUserEmailHandler)

        // ROUTE - UPLOAD AVATAR IMAGE
        server.post('/api/user/upload', uploadAvatar.single('file'), uploadFileHandler)

        // ROUTE - GET AVATAR
        server.get('/api/user/avatar/:file', retrieveUserAvatarHandler)

        // ROUTE - SAVE FOLLOW
        server.post('/api/follow/save', jasonBodyParser, saveFollowHandler)

        // ROUTE - DELETE FOLLOW
        server.delete('/api/follow/unsave/:followedId', deleteFollowHandler)

        // ROUTE - FOLLOWING LIST
        server.get('/api/follow/following', retrieveFollowingUsersHandler)

        // ROUTE - FOLLOWERS LIST
        server.get('/api/follow/followers', retrieveFollowersUsersHandler)

        // ROUTE - SAVE POST
        server.post('/api/post', jasonBodyParser, uploadPost.single('file'), savePostHandler)

        // ROUTE - RETRIEVE ALL POSTS
        server.get('/api/posts', retrieveAllPostsHandler)

        // ROUTE - RETRIEVE POSTS FROM USER
        server.get('/api/post', retrieveUserPostsHandler)

        // ROUTE - RETRIEVE ANY POST
        server.get('/api/post/:postId', retrieveSinglePostHandler)

        // ROUTE - DELETE POST
        server.delete('/api/post/:postId', deletePostHandler)

        // CONNECTION
        server.listen(process.env.PORT, () => console.log(`Server Online! Listening on: ${process.env.PORT}`))
    })
    .catch(error => console.log(error))
