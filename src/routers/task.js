const express = require('express')
require('../db/mongoose')
const Task = require('../models/task')
const router = express.Router()
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req, res) => {
    //const task = new Task(req.body);
    
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
        await task.save();
        res.status(201).send({
            status: 'Successfully saved',
            task: task
        })
    } catch(e) {
        res.status(400).send(e);
    }
})

router.get('/tasks', auth, async (req, res)=> {
    try {
        //const tasks = await Task.find({ owner: req.user._id})
        await req.user.populate('tasks').execPopulate()
        res.status(201).send({tasks: req.user.tasks})
    } catch(e) {
        res.status(401).send();
    }
})

router.get('/tasks/:id', auth,  async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({ _id, owner: req.user._id})
        if(!task) return res.status(404).send();
        res.status(201).send({
            task: task
        })
    } catch(e) {
        res.status(500).send();
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"]
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidUpdate) return res.status(401).send({
        msg: "Invalid update parameters"
    })
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if(!task) res.status(404).send();

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save()
        
        //below method wont trigger the Schema middleware
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!task) return res.status(404).send();
        res.send(task);
    } catch(e) {
        res.status(400).send();
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOneAndDelete({ _id: _id, owner: req.user._id});
        if(!task) return res.status(404).send();
        res.send({
            deletedTask: task
        })
    } catch(e) {
        res.status(500).send()
    }
})

module.exports = router