const models = require('../../sequelize');

async function get(){}

async function removeById(id){
    try{
        return await models.bookItem.destroy({ where: {id: id} });          
    } catch (e) {
        throw e;
    }
}

async function getBookItemPossesedByUser(bookId, profileId, status){
    try{
        const bookItems = await models.bookItem.findAll({
            where: {
                "bookId": bookId, 
                "profileId": profileId,
                "status": status
            }
        })
        return bookItems;
    } catch (e) {
        throw e;
    }
}


async function getById(id){
    try{
        const bookItem = await models.bookItem.findByPk(id);
        return bookItem;    
    } catch (e) {
        throw e;
    }
}

async function create(body){
    try{
        return await models.bookItem.create(body);
    } catch (e) {
        throw e;
    }
}

async function updateBookItem(id, fieldsToUpdate){
    try{
        return await models.bookItem.update(fieldsToUpdate, { where: { id: id } , returning: true} );
    } catch (e) {
        throw e;
    }
}

module.exports = {
    get,
    getById,
    create,
    updateBookItem,
    removeById,
    getBookItemPossesedByUser
}