import { Types } from 'mongoose'
const { ObjectId } = Types

function name() {
    return `name-${Math.random()}`
}

function surname() {
    return `surname-${Math.random()}`
}

function username() {
    return `username-${Math.random()}`
}

function email() {
    return `email-${Math.random()}@email.com`
}

function password() {
    return `password-${Math.random()}`
}

function id() {
    return new ObjectId()
}

function text() {
    return `text-${Math.random()}`
}

function file() {
    return `file-${Math.random()}`
}

const random = {
    name,
    surname,
    username,
    email,
    password,
    id,
    text,
    file
}

export default random