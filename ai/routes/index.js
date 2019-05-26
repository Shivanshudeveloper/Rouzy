const express = require('express')
const router = express.Router()

// Welcome
router.get('/', (req, res) => {
    res.render('welcome')
})
// Features
router.get('/features', (req, res) => {
    res.render('features')
})
// About
router.get('/about', (req, res) => {
    res.render('about')
})
// Dashboard
router.get('/dashboard', (req, res) => {
    res.render('dashboard', {
        name: req.user.name
    })
})



module.exports = router