var express = require('express');
var router = express.Router();
const { runQuery } = require('../db/productDb');

/* GET users listing. */
router.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const rows = await runQuery("SELECT * FROM Cameras WHERE id = ?", [id]);
    const product = rows[0];

    if (!product) {
        return res.status(404).render("error", {message: "Product not found"});
    }
    res.render("product", {product});
  }
  catch (err) {
    next(err);
  }
});

module.exports = router;
