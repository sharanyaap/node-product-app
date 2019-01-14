// routers/productRouter.js
const express = require('express');


const Product = require('../models/product');

const router = express.Router();


// GET /products
router.get('/products', function (req, res) {
    console.log('/products called');
    Product.getAllCB(function callback(err, products) {
        console.log('/products callback with result ');
        // async call back
        if (err) {
            return res.status(500)
                .json({error: err})
        }

        res.json(products);
    })

    console.log('/products exit');


});

//es6 promise example
router.get('/products/promise', function (req, res) {
    let promise = Product.getAll();
    promise
        .then(function (products) { // resolve(rows)
            res.json(products);
        })
        .catch(function (err) { // reject(err)
            res.status(500)
                .json({error: err})
        })
})

// ES8, async and await keyword
router.get('/products/es8', async function (req, res) {
    try {
        let products = await Product.getAll();
        return res.json(products);
    }
    catch (err) {
        res.status(500)
            .json({error: err})
    }
})

// get single product
// GET /products/1234
// router.get('/products/:id', async function(req, res){

//     try {
//         let result = await Product.get(req.params.id)

//         if (result.rows.length > 0) {
//             let product =  result.rows[0];
//             res.json(product)
//         }

//     }catch (err){
//         res.status(500)
//         .json({error: err})
//     }
// });

router.get('/products/:id', async function (req, res) {

    try {
        let product = await Product.get(req.params.id)

        if (!product) { // product is undefined
            return res.status(404)
                .json({error: 'resource not found'})
        }

        res.json(product)

    } catch (err) {
        res.status(500)
            .json({error: err})
    }
});

// create new resource

// POST /products
// headers
// {{payload as json }} - body
router.post('/products', async function (req, res) {
    try {
        // body {name, price}
        let result = await Product.save(req.body);
        res.json(result)
    } catch (err) {
        res.status(500)
            .json({error: err})
    }
})

// update existing resource
// PUT /products/1234
router.put('/products/:id', function (req, res) {
    res.json({result: true, id: req.params.id});
})


// delete existing resource
// DELETE /products/1234
router.delete('/products/:id', async function (req, res) {
    try {
        await Product.delete(req.params.id);
        res.sendStatus(200)
    } catch (err) {
        res.status(500).json({error: err});
    }
})


module.exports = router;