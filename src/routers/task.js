const express = require('express')
require('../db/mongoose')
const Task = require('../models/task')
const router = express.Router()

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
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

router.get('/tasks', async (req, res)=> {
    try {
        const tasks = await Task.find({})
        res.status(201).send(
            {
                tasks: tasks
            }
        )
    } catch(e) {
        res.status(401).send();
    }
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findById(_id);
        if(!task) return res.status(404).send();
        res.status(201).send({
            task: task
        })
    } catch(e) {
        res.status(401).send();
    }
})

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"]
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidUpdate) return res.status(401).send({
        msg: "Invalid update parameters"
    })
    try {
        const task = await Task.findById(req.params.id)
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

router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findByIdAndDelete(_id);
        if(!task) return res.status(404).send();
        res.send({
            deletedTask: task
        })
    } catch(e) {
        res.status(500).send()
    }
})

module.exports = router