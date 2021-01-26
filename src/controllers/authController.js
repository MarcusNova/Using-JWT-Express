//Aqui pondremos las rutas que necesitamos
const { Router, json } = require('express');
const router = Router();
const config = require('../config');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const verifyToken = require('./verifyToken');

router.post('/signup', async (req, res, next) => {
    const { username, email, password } = req.body;
    const user = new User ({
        username,
        email,
        password
    });
    user.password = await user.encryptPassword(user.password);
    await user.save();
    //Le pasamos un id al token
    const token = jwt.sign({id: user._id}, config.secret, {
        expiresIn: 60*60*24
    });

    res.json({ auth:true, token:token });
})

router.get('/profile', verifyToken, async (req, res, next) => { 
    const user = await User.findById(req.userId, { password: 0 });
    if(!user){
        res.status(404).send('No user find');
    } 
    res.json(user);    
})


router.post('/signin', async (req, res, next) => {
    const {email, password} = req.body;
    const user = await User.findOne({email: email});
    if(!user) {
        return res.status(404).send('This email does not exist');
    }
    const validPassword = await user.validatePassword(password);
    if(!validPassword) {
        return res.status(401).json({auth: false, token:null});
    }

    const token = jwt.sign({id: user._id}, config.secret, {
        expiresIn: 60*60*24
    });
    res.json({auth: true, token: token});
})


module.exports = router;