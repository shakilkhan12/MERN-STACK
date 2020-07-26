const express = require("express")
const { check, validationResult } = require('express-validator');
const auth = require("../middleware/auth")
const User = require("../models/User")
const Contact = require("../models/Contact")
const router = express.Router()
// @route     GET api/contacts
// @desc      Get all user contacts
// @access    Private
// 5efb26b9b23ddf2bd00af2ea
// 5efb26b9b23ddf2bd00af2ea
router.get("/", auth, async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 })
        res.json(contacts);
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error!')
    }
})

// @route     POST api/contacts
// @desc      Add new contact
// @access    Private

router.post("/", [auth, [
    check('name', 'Name is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { name, email, phone, type } = req.body;
    try {
        const newContact = new Contact({
            name,
            email,
            phone,
            type,
            user: req.user.id
        })
        const contact = await newContact.save()
        res.json(contact)
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error')
    }
})

// @route     PUT api/contacts:id
// @desc      Update contact
// @access    Private

router.put("/:id", (req, res) => {
    const id = req.params.id;

    const { name, email, phone, type } = req.body;
    // res.json({ msg: req.body });
    try {
        // const updateResult = await Contact.findByIdAndUpdate(id, { name, email, phone, type })
        // if (updateResult) {
        //     res.json({ msg: updateResult });
        // }
    } catch (error) {
        res.json({ msg: error })
    }
})

// @route     DELETE api/contacts:id
// @desc      Delete contact
// @access    Private

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const res = await Contact.findByIdAndRemove(id)
        if (res) {
            res.json({ msg: res });
        }
    } catch (err) {
        res.json(err)
    }
})

module.exports = router