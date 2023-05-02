const express = require('express');
const router = express.Router();
const { signup, signin} = require('../controllers/auth');
const {verifyJWT} = require('../utils/auth')

router.post('/signup', signup);
router.post('/signin', signin);

router.get('/getName', verifyJWT, (req, res) => {
    return res.json({isLoggedIn: true})
});

module.exports = router;