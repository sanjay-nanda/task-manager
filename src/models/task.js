const mongoose = require('mongoose');
const validator = require('validator');

const Task = mongoose.model('Task', {
    description: {
        type: String,
        trim: true,
        required: true,
        minLength: 2
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

module.exports = Task;
