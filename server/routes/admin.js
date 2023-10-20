const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require("dotenv").config();



const adminLayout = '../views/layouts/admin';

const jwtSecret = process.env.JWT_SECRET;

/** 
 * 
 * Admin
 */
router.get('/admin', async (req, res) => {
    try {

        const locals = {
            title: 'Admin Page',
            description: "Blah Blah Blah"
            
        }


        res.render('admin/index', {locals, layout: adminLayout}); // we're giving our post ejs file the data object.

    } catch (error) {
        console.log(error);
    }


});











/** 
 * 
 * Admin 
 */
router.post('/admin', async (req, res) => {
    try {

        const { email, password } = req.body;
        // check if email in datbase

        const user = await User.findOne({email})

        if (!user) {
            return res.status(401).json({ message: 'Invalid user.'})
        }

        const isValid = await bcrypt.compare(password, user.password);

        if(!isValid){
            return res.status(401).json({ message: 'Invalid user.'})
        }

        const token = jwt.sign({ userId: user._id}, jwtSecret );
        res.cookie('token', token, { httpOnly: true });

        res.redirect('/panel')




    } catch (error) {
        console.log(error);
    }
});



router.get('/panel', async (req, res) => {

    res.render('admin/panel')

});





router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10)


        try {
            const user = await User.create({ email, password: hashedPassword})
            res.redirect('/admin')
        } catch (error){
            if (error.code === 11000){
                res.status(409).json({message: 'User already exists.'})
            }
            res.status(5000).json({message: 'Internal server error! '})
        }


    } catch (error) {
        console.log(error);
    }


});


module.exports = router;