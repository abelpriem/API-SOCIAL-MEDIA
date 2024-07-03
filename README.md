# API REST - SOCIAL MEDIA &middot; [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

![socialmedia](https://github.com/abelpriem/API-SOCIAL-MEDIA/assets/133054841/531b0dd5-391f-474c-be8a-eb689711d019)

> This is a complete, fully functional `API Rest` to implement on a social media website with `CRUD`. It is capable of create diferent users with his own publications or posts with the ability to follow different users, upload their avatars and download it too.

## SUMMARY

`API Rest - Social Media`
- [x] Functional API to download and deploy
- [x] Using `MULTER` librery and `FS` package from NodeJS to upload images and associate them with certain profiles, posts or avatars too
- [x] Implement encryption and user credential security with `JWT`
- [x] `CRUD system`
- [x] All logic has been tested using `MOCHA`, with unit testing, html testing and .spec format

## MODELS

`USERS`

```json
{
  "id" : ObjectId(),
  "name" : {
    type: String,
    required: true
},
  "surname" : {
    type: String,
},
  "username" : {
    type: Date,
    required: true
},
"email" : {
    type: String,
    unique: true,
    required: true
},
"password" : {
    type: String,
    required: true,
    minlength: 8
},
"role" : {
    type: String,
    default: 'user'
},
  "image" : {
    type: String,
    default: default.jpg
  },
  "created_at" : {
    type: Date,
    default: Date.now()
  }
}
```

`POSTS`

```json
{
  "id" : ObjectId(),
  "user" : {
    type: Schema.ObjectId,
    ref: 'User'
},
  "text" : {
    type: String,
    required: true
},
  "file" : {
    type: String,
    default: 'none'
},
  "created_at" : {
    type: Date,
    default: Date.now()
  }
}
```

`FOLLOWS`

```json
{
  "id" : ObjectId(),
  "user" : {
    type: Schema.ObjectId,
    ref: 'User'
},
  "followed" : {
    type: Schema.ObjectId,
    ref: 'User'
},
  "created_at" : {
    type: Date,
    default: Date.now()
  }
}
```

*ON CONSTRUCTION*

