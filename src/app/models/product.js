// model/product.js

const uuidv1 = require('uuid/v1');
const cassandraClient = require('../config/cassandra');


const Product = {
    getAllCB: function(cb) {

        cassandraClient
            .execute('SELECT * from workshop247.products',
                [], // parameter

                function callback(err, result) {
                    if (cb && err) {
                        return cb(err, null);
                    }

                    if (cb) {
                        // result.rows is ersult
                        // is a list of products array
                        cb(null, result.rows)
                    }
                    //result.rows
                }
            )
    },

    // Promise is part of JS lang

    getAll: function() {
        let promise = new Promise(function(resolve, reject){
            // todo, async part
            cassandraClient
                .execute('SELECT * from workshop247.products',
                    [], // parameter

                    function callback(err, result) {
                        // fulfil/reject the promise
                        if (err) {
                            return reject(err); // promise.catch
                        }

                        // promise.then
                        resolve(result.rows);
                    });
        })

        return promise;
    },

    get: function(id) {
        return  cassandraClient
            .execute('SELECT * from workshop247.products WHERE id=?',
                [id])
            .then(function(result){
                if (result.rows.length > 0) {
                    // take product as object, resolve as promise(product)
                    return  result.rows[0]; // product
                }

                // by default
                // return undefined;
            })

    },

    save: function(product) {
        console.log("product is ", product);
        const uid = uuidv1()
        return cassandraClient.execute("INSERT INTO workshop247.products (id, name, price) VALUES (?, ?, ?)",
            [uid, product.name, product.price], {prepare: true})
            .then (function(result){
                // return {id: uid}
                return Product.get(uid)
            })

    },

    // delete a brand
    delete: function(id) {
        return    cassandraClient
            .execute('DELETE from workshop247.products WHERE id=?',
                [id])

    }

}

module.exports = Product;