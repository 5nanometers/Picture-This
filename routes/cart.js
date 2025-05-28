var express = require('express');
var router = express.Router();
const { runQuery } = require('../db/usersDb');
const { runQuery: runProductQuery } = require('../db/productDb');


router.get('/', async (req, res, next) => {
    const username = req.session?.user?.username;

    if (!username) {
        return res.redirect('/login');
    }

    try {
        const shoppingCartJSON = await runQuery(
            "SELECT shopping_cart FROM Users WHERE username = ?", [username]
        );

        // Convert JSON to array
        // ["1", "2", "3"]
        const storedCartIds = JSON.parse(shoppingCartJSON[0]?.shopping_cart || '[]');
        // console.log(shoppingCartJSON);
        // console.log(storedCartIds);


        // Convert array's strings to numbers
        const idArray = storedCartIds.map(id => Number(id));
        // console.log(idArray);

        let cart = [];
        let total = 0;


        if (idArray.length > 0) {
            const itemQty = {};
            idArray.forEach(id => {
                itemQty[id] = (itemQty[id] || 0) + 1;
            });

            const query = [...new Set(idArray)].map(() => '?').join(',');
            const products = await runProductQuery(
                `SELECT * FROM Cameras WHERE id IN (${query})`, [...new Set(idArray)]
            );

            cart = products.map(product => {
                const quantity = itemQty[product.id] || 1;
                total += product.price * quantity;

                return {
                    ...product,
                    quantity
                };
            });
            
            // console.log('Final cart:', cart, total);
        } else {
            // console.log('Final cart:', cart, total);
        }

        res.render('cart', { cart, total });

    } catch (err) {
        next(err);
    }
});

// Add to cart
router.post('/add/:id', async (req, res, next) => {
    const productId = req.params.id;
    const username = req.session?.user?.username;

    if (!username) {
        return res.redirect('/login');
    }

    try {
        // Get user shopping cart in JSON string format
        const shoppingCartJSON = await runQuery(
            "SELECT shopping_cart FROM Users WHERE username = ?", [username]
        );

        // Convert to JSON string to array
        const tempCart = JSON.parse(shoppingCartJSON[0]?.shopping_cart || '[]');

        // Add new product to cart via id
        tempCart.push(productId);
        // console.log(tempCart);

        // Save updated cart to database
        await runQuery(
            "UPDATE Users SET shopping_cart = ? WHERE username = ?", [JSON.stringify(tempCart), username]
        );

        res.redirect('/cart');
    } catch (err) {
        next(err);
    }
});

// Remove just 1 instance of a product from cart
router.post('/remove-one/:id', async (req, res, next) => {
    const username = req.session?.user?.username;
    const productIdToRemove = req.params.id;

    if (!username) {
        return res.redirect('/login');
    }

    try {
        // Get user shopping cart in JSON string format
        const shoppingCartJSON = await runQuery(
            "SELECT shopping_cart FROM Users WHERE username = ?", [username]
        );
        // Convert to JSON string to array
        let tempCart = JSON.parse(shoppingCartJSON[0]?.shopping_cart || '[]');

        // Find index 
        const indexToRemove = tempCart.findIndex(id => id == productIdToRemove);

        if (indexToRemove !== -1) {
            // Remove product from cart
            tempCart.splice(indexToRemove, 1);
            await runQuery(
                "UPDATE Users SET shopping_cart = ? WHERE username = ?", [JSON.stringify(tempCart), username]
            );
        }

        res.redirect('/cart');
    } catch (err) {
        next(err);
    }
});



module.exports = router;
