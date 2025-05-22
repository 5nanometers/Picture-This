var express = require('express');
var router = express.Router();
const { runQuery } = require('../db/usersDb');

/* GET users listing. */
router.get('/', function (req, res, next) {
  try {
    ;
    res.render('login', { 
      title: 'Log in to your account: Picture This!',
      error: null,
    });
  } catch (error) {
    next(error);
  }
});

// Login form
router.post('/', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const users = await runQuery(
      "SELECT * FROM Users WHERE username = ? and password = ?",
      [username, password]);
    if (users.length == 0) {
      // return res.status(404).send("User not found");
      return res.render('login',
        {
          title: 'Log in to your account: Picture This!',
          error: 'Invalid username or password',
        }
      );
    } else {
      // res.json(users);
    }

    // Stores user object in Express Session
    req.session.user = { username: users[0].username };
    res.redirect('/');
  }
  catch (err) {
    next(err);
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
