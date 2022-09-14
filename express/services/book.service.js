const { sequelize } = require('../../sequelize');
const models = require('../../sequelize');

async function get(){}

async function getBooksByFuzzySearch(searchBy, searchString, limit, pageNumber) {
    try{    
        const offset = limit * pageNumber - limit;
        
        const query = `select * from books 
                        where SIMILARITY( METAPHONE(${searchBy},10), METAPHONE('${searchString}',10)) > 0.3
                        order by  SIMILARITY( METAPHONE(${searchBy},10), METAPHONE('${searchString}',10)) 
                        DESC limit ${limit} offset ${offset};`


        const countQuery = `select count(*) from books where SIMILARITY(METAPHONE(${searchBy},10), METAPHONE('${searchString}',10)) > 0.3;`;
        
        // should be transactionsal 
        // cost here when there are so many records

        const books = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
        const totalCount = await sequelize.query(countQuery,  { type: sequelize.QueryTypes.SELECT })
        return {items: books, totalCount : totalCount[0].count} 

    } catch (e){
        console.log(e);
        throw e;
    }
}

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
        const book = await models.book.findOne({ where: { isbn: isbn } });
        return book;
    } catch (e) {
        throw e;
    }
}

async function getByTitle(title){
    try{
        const book = await models.book.findOne({ where: { title: title } });
        return book;
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
        return await models.book.update(fieldsToUpdate, { where: { id: id } , returning: true} );
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
    removeById,
    getBooksByFuzzySearch
}