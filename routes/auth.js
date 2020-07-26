const express = require("express")
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const config = require("config")
const auth = require("../middleware/auth")
const router = express.Router()
const User = require("../models/User")
// @route     GET api/auth
// @desc      Get logged in user
// @access    Private

router.get("/", auth, async (req, res) => {
    try {
     const user = await User.findById({_id: req.user.id}).select("-password");
     res.json(user);
    } catch(err) {
        console.log(err);
        res.status(500).send('Server Error!')
    }
})

// @route     POST api/auth
// @desc      Auth user and get token
// @access    Public

router.post("/",[
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({email: email})
        if(!user){
            return res.status(400).json({msg: 'Invalid credentials/Email'})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({ msg: 'Invalid credentials/Password' })
        }
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, config.get("jwtsecret"), {
            expiresIn: 360000
        }, (err, token) => {
            if(err) throw err;
            res.json({token})
        })
    } catch(err) {
        console.log(err.message)
        res.status(500).send('Server error!')
    }
})

module.exports = router