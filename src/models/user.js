const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 1  
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value))
                throw new Error('Not a valid email');
            }
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        trim: true,  
        validate(value){
            if(value.toLowerCase().includes("password"))
                throw new Error('Password should not contain "password"!')
        }
    },
    age: {
        type: Number,
        default: 0
    }
})

userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User;