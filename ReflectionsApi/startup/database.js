const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');

module.exports = function () {

    console.log('jwt key [', config.jwtPrivateKey, ']');
    console.log('MongoDBUrl:', config.MongoDBUrl);
    console.log('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));
    //set REFLECTIONS_JWTPRIVATEKEY=jwtprivatekeyshouldbeinEnvVariable

    mongoose.connect(config.MongoDBUrl, { useNewUrlParser: true })
        .then(() => winston.info(`Connected to MongoDB ${config.MongoDBUrl}...`));
}
