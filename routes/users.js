var express = require('express');
var router = express.Router();
const { runQuery } = require('../db/usersDb');

router.get('/:username', async (req, res, next) => {
    const username = req.params.username;
    try {
            const rows = await runQuery(
                "SELECT * FROM Users WHERE username = ?", [username]);
                if (rows.length == 0) {
                    return res.status(404).send("User not found");
                } else {
                    res.json(rows);
                }
    }
    catch (err) {
        next(err);
    }
});


module.exports = router;
