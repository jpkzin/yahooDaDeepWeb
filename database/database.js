const Sequelize = require('sequelize');

const connection = new Sequelize('yahoodeepweb','root', 'Enatal789_',{
    host:'localhost',
    dialect:'mysql'
});

module.exports = connection;