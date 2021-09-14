const express = require('express');
const router = express.Router();

router.use('/users', require('./user'));
router.use('/articles', require('./article'));
router.use('/authors', require('./author'));

module.exports = router;