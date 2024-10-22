const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas', 'root', "@Mag1324ads", {
    host: 'localhost', 
    dialect: 'mysql'
})

module.exports = connection;