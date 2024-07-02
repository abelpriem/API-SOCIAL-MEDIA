import mongoose from 'mongoose'
const { model, Schema } = mongoose

// DATA TYPES
const user = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true,
        minlength: 8
    },
    role: {
        type: String,
        default: 'user'
    },
    image: {
        type: String,
        default: 'default.png'
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
})

const follow = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    followed: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
})

const post = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    text: {
        type: String,
        required: true
    },
    file: {
        type: String,
        default: 'none'
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
})

// MODELS 
const User = new model('User', user)
const Follow = new model('Follow', follow)
const Post = new model('Post', post)

export {
    User,
    Follow,
    Post
}