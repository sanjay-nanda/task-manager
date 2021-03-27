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
    }
})

module.exports = Task;
