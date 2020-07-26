const express = require("express")
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const config = require("config")
const router = express.Router()
const User = require("../models/User")
// @route     POST api/user
// @desc      Register a user
// @access    Public

router.post("/", [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please add a valid email").isEmail(),
    check('password', "Please enter a password with 6 or more chacracters").isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const { name, email, password } = req.body;
    try {
       let user = await User.findOne({email: email})
       if(user){
           return res.status(400).json({msg: 'User already exist'})
       }
       user = new User({
           name: name,
           email: email,
           password: password
       })
       const salt = await bcrypt.genSalt(10)
       user.password = await bcrypt.hash(password, salt)
      await user.save();
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
    } catch(error){
        console.log(error.message)
        res.status(500).send('Server error')
    }
})

module.exports = router