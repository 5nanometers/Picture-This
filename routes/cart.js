var express = require('express');
var router = express.Router();
const { runQuery } = require('../db/usersDb');

// Add to cart
router.post('/add/:id', async (req, res, next) => {

    
    catch (err) {
        next(err);
    }
});


module.exports = router;
