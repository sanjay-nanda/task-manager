const express = require('express')
require('../db/mongoose')
const User = require('../models/user')
const router = new express.Router()
const multer = require('multer');
const sharp = require('sharp')

//this is for the auth middleware
//this function can be given as input to individual routes
//so that only when the auth fn is returned (next()) the route will execute
const auth = require('../middleware/auth')

//we use the getPublicProfile function defined on the userSchema.methods
//to remove the sensitive info about the user and just send the token and 
//some info about the user currentl logged in
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try{
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send(
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

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        
        await req.user.save()

        res.status(200).send(req.user);

    } catch (e) {
        res.status(500).send(e);
    }
})


router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []

        await req.user.save()
        res.status(200).send(req.user);
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidUpdate){
        return res.status(400).send({
            msg: "Invalid update parameters"
        })
    }
    try {

        updates.forEach((update) => req.user[update] = req.body[update]);

        await req.user.save();

        res.send({
            user: req.user
        })

    } catch(e) {
        res.status(400).send(e);
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch(e) {
        res.status(500).send(e);
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload jpg,jpeg or png formats'))
        }

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('profile_pic'), async (req, res) => {
    
    const buffer = await sharp(req.file.buffer).resize({ width: 256, height: 256}).png().toBuffer();

    req.user.avatar = buffer
    await req.user.save()
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    try{
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send({
            msg: e
        })
    }
})

router.get('/users/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error('Image Unavailable')
        }
        res.set('Content Type', 'image/png')
        res.send(user.avatar)
    } catch(e) {
        res.status(404).send(e);
    }
})

module.exports = router;