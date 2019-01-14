// routers/brandRouter.js
const rp = require('request-promise');

module.exports = {
    getBrands: function(req, res) {
        rp('http://api.nodesense.ai/api/brands')
            .then (function (jsonString) {
                res.json (JSON.parse(jsonString))
            })
            .catch(function (error) {
                res.status(500)
                    .json({error: error})
            })
    },

    getBrand : async function(req, res) {
        try {
            let jsonString =  await rp('http://api.nodesense.ai/api/brands/' + req.params.id)
            res.json (JSON.parse(jsonString))
        }
        catch(error) {
            res.status(500)
                .json({error: error})
        }
    }
}