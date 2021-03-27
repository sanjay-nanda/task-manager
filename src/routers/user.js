const express = require('express')
require('../db/mongoose')
const User = require('../models/user')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try{
        await user.save();
        const token = await user.generateAuthToken();
        res.send(
            {
                user,
                token
            }
        )
    }
    catch(e) {
        res.send(e);
    }
})

router.get('/users', async (req, res) => {
    try{
    const users = await User.find({});
        res.status(201).send({
            users: users
        })
    } catch (e) {
        res.status(500).send();
    }
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try{
        const user = await User.findById(_id);
        if(!user){
            return res.status(404).send()
        }
        res.status(200).send({
            user: user
        })
    } catch(e) {
        res.status(401).send(e);
    }
})

router.post('/users/login', async (req, res) => {
    
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({
            user, token
        });
    } catch(e) {
        res.status(400).send(e);
    }
    
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidUpdate){
        return res.status(400).send({
            msg: "Invalid update parameters"
        })
    }
    try {

        const user = await User.findById(req.params.id);

        updates.forEach((update) => user[update] = req.body[update]);

        await user.save();

        //Using this method does not save the model, thus we can't hash the passwords
        //Thus we need to find the user and update seperately and save it.
        //otherwise it wont trigger the save function in the userSchema's middleware.
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!user) return res.status(404).send();
        res.send({
            user: user
        })

    } catch(e) {
        res.status(400).send(e);
    }
})

router.delete('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(_id);
        if(!user) return res.status(404).send();
        res.send({
            deletedUser: user
        })
    } catch(e) {
        res.status(500).send();
    }
})

module.exports = router;