const models = require('../../sequelize');

async function get(){}

async function removeById(id){
    try{
        return await models.book.destroy({ where: {id: id} });          
    } catch (e) {
        throw e;
    }
}

async function getById(id){
    try{
        const book = await models.book.findByPk(id);
        return book;    
    } catch (e) {
        throw e;
    }
}

async function getByIsbn(isbn){
    try{
        const profile = await models.book.findOne({ where: { isbn: isbn } });
        return profile;
    } catch (e) {
        throw e;
    }
}

async function getByTitle(title){
    try{
        const profile = await models.book.findOne({ where: { title: title } });
        return profile;
    } catch (e) {
        throw e;
    }
}

async function create(body){
    try{
        return await models.book.create(body);
    } catch (e) {
        throw e;
    }
}

async function update(id, fieldsToUpdate){
    try{
        return await models.profile.update(fieldsToUpdate, { where: { id: id } , returning: true} );
    } catch (e) {
        throw e;
    }
}

module.exports = {
    get,
    getById,
    getByIsbn,
    getByTitle,
    create,
    update,
    removeById
}