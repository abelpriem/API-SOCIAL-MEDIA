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

const publication = new Schema({

})

const follow = new Schema({

})

const User = new model('User', user)
const Publication = new model('Publication', publication)
const Follow = new model('Follow', follow)

export {
    User
}