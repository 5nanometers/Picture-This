var express = require('express');
var router = express.Router();
const { runQuery } = require('../db/usersDb');

/* GET register page. */
router.get('/', function (req, res, next) {
  try {
    ;
    res.render('register', { 
      title: 'Create New Account: Picture This!',
      error: null,
    });
  } catch (error) {
    next(error);
  }
});

// Register form
router.post('/', async (req, res, next) => {
  const { username, password } = req.body;
  try {

    // Check if user account already exists
    const existingUser = await runQuery(
      "SELECT * FROM Users WHERE username = ?",
      [username]
    );

    if (existingUser.length > 0) {
        return res.render('register', {
            title: 'Create New Account: Picture This!',
            error: 'Username already taken'
        });
    }

    // Add user to database
    else {
        await runQuery("INSERT INTO Users (username, password, shopping_cart) VALUES (?, ?, ?)", [username, password, JSON.stringify([])]);
    }

    // Add user to Expression Session
    req.session.user = { username }
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
