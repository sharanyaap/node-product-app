/**
 * Created by sharanya.p on 11/20/2018.
 */
// config/index.js
const jsonfile = require('jsonfile')
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development'

const filePath = path.join(__dirname,
    '../../..',
    'environments',
    NODE_ENV + '.json')

const config = jsonfile.readFileSync(filePath);

module.exports = config;