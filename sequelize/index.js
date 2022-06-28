const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('libdb', 'postgres', 'postgres',{
    host: 'localhost',

    dialect: 'postgres'
});

const models = {
    member : require('./models/member.model')(sequelize, DataTypes),
    book : require('./models/book.model')(sequelize, DataTypes)
}

Object.keys(models).forEach((modelName) => {
    if('associate' in models[modelName]){
        models[modelName].associate(models);
    }
})

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
