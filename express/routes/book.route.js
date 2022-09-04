const express = require('express');
const { authorization } = require('../auth/authorization');
const { create, update, getById, removeById, getBooksByFuzzySearch } = require('../services/book.service');
const { createBookSchema } = require('./../validations/createBookSchema')
const { updateBookSchema } = require('./../validations/updateBookSchema')

const bookRouter = express.Router();

const {
    NotFoundError, 
    DatabaseError, 
    ForbiddenRequestError, 
    BadRequestError
} = require('./../errorHandling/errors');

const { Validator } = require('express-json-validator-middleware');
const { validate } = new Validator();

// bookRouter.get('/', authorization, async (req, res) => {
// 	try{} catch (e) {}
// })

bookRouter.get('/autocomplete', authorization, async(req, res, next) => {
    try {
        const books = await getBooksByFuzzySearch(
            req.query.searchBy, 
            req.query.searchString, 
            req.query.limit, 
            req.query.pageNumber
        );
        
        res.send(books);
    } catch (e) {
        return next(new DatabaseError("Internal Server Error"));
    }   
})

bookRouter.get('/getById/:id', authorization, async (req, res, next) => {
    try{
        if(!req.params.id){
            return next(new BadRequestError("book id is required "));
        }

        const book = await getById(req.params.id);
        if(!book) {
            return next(new NotFoundError("cannot find the book with the given id"));
        }
        const resbody = book.dataValues;
        res.status(200).send(resbody);
    } catch (e) {
        return next(new DatabaseError("Internal Server Error"));
    }
})

bookRouter.get('/getByIsbn/:isbn', authorization, async (req, res, next) => {
    try{
        
        if(!req.params.isbn){
            return next(new BadRequestError("book isbn is required"));
        }
        
        const book = await getByIsbn(req.params.isbn);
        if(!book) {
            return next(new NotFoundError("cannot find the book with the given book isbn"));
        }
        const resbody = book.dataValues;
        res.status(200).send(resbody);
    } catch (e) {
        return next(new DatabaseError("Internal Server Error"));
    }
})

bookRouter.get('/getByTitle/:title', authorization, async (req, res, next) => {
    try{

        if(!req.params.title){
            return next(new BadRequestError("book title is required"));
        }

        const book = await getByTitle(req.params.title);
        if(!book) {
            return next(new NotFoundError("cannot find the book with the given title"));
        }
        const resbody = book.dataValues;
        res.status(200).send(resbody);
    } catch (e) {
        return next(new DatabaseError("Internal Server Error"));
    }
})



bookRouter
.post('/',
    authorization, 
    (req, res, next) => {	
        if(req.user.role !== 'ADMIN') return next(new ForbiddenRequestError("request denied to create book"))
        return next();
    }, 
    validate({body: createBookSchema}), 
    async (req, res, next) => {
        try{
            console.log(req.body);
            const book = await create(req.body);
            res.status(201).send({id : book.dataValues.id});
        } catch (e) {
            console.log(e);
            return next(new DatabaseError("Internal Server Error"));
        }
    }
)

bookRouter
.put('/:id', 
    authorization,
    (req, res, next) => {
        if(req.user.role !== 'ADMIN'){
            return next(new ForbiddenRequestError("request denied to update book"))
        }
        return next();
    }, 
    validate({body: updateBookSchema}),
    async (req, res, next) => { 
        try{
            console.log(req.body)
            const book = await update(req.params.id, req.body);
            console.log(book)
            res.status(201).send(book);
        } catch (e) {
            return next(new DatabaseError("Internal Server Error"));
        }
    }
)

bookRouter.delete('/:id', authorization, async (req, res, next) => {
    try{

        if(!req.params.title){
            return next(new BadRequestError("book id is required"));
        }

        const book = await getById(req.params.id);
        const bookItems = await book.getBookItems();
        
        for(const bookItem of bookItems){
            if(bookItem.dataValues.status == 'LOANED'){
                return next(new ForbiddenRequestError("can't delete the book when bookItem is owned"));
            }
        }

        const response = await removeById(req.params.id);
        res.status(200).send("book successfully deleted");

    } catch (e) {
        return next(new DatabaseError("Internal Server Error"));
    }
})

module.exports = bookRouter

