const express = require('express');
const router = express.Router();
const { signup, signin} = require('../controllers/auth');
const {verifyJWT} = require('../utils/auth')

router.post('/signup', signup);
router.post('/signin', signin);

router.get('/getName', verifyJWT, (req, res) => {
    console.log("\n\nUSER:",req.user,"\n")
    return res.json({isLoggedIn: true, user: req.user})
});

module.exports = router;