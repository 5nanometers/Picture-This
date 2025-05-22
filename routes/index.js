var express = require('express');
var router = express.Router();
const { getProducts } = require('../db/productDb');

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const products = await getProducts();
    // console.log('Retrieved: ', products);
    res.render('index', { title: 'Picture This: Camera Shop', products});
  }  catch (error) {
    next (error);
  }
});

module.exports = router;
