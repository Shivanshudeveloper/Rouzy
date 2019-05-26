const express = require('express')
const router = express.Router()
const User = require('../models/User')
const swal = require('sweetalert')
const bcrypt = require('bcryptjs')
const passport = require('passport')
// Login
router.get('/login', (req, res) => {
    res.render('login')
})

// Register
router.get('/register', (req, res) => {
    res.render('register')
})
// Register Handler
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body
    let errors = [];
    if (!name || !email || !password || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }
    // Password Check
    if (password !== password2) {
        errors.push({ msg: 'Password dose not match' })
    }
    // Password Length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be atleast 6 character' })
    }

    if (errors.length > 0) {
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
    } else {
        // Form Validation Passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push({ msg: 'Email already exist' })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    })
                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        // Set Password to hash
                        newUser.password = hash
                        // Save User
                        newUser.save()
                            .then(user => {
                                res.redirect('/users/login')
                            })
                            .catch(err => console.log(err))
                    }))
                }
            })
    }
})

// Login Handler
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})
// LogOut Handle
router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/users/login')
})
module.exports = router