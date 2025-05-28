var express = require('express');
var router = express.Router();

router.get('/', async (req, res, next) => {
    const user = req.session.user;

    if (!user) {
        return res.redirect('/login');
    }

    try {
        res.render('profile', { user });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
