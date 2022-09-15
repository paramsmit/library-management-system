const express = require('express');
const { authorization } = require('../auth/authorization');
const { create, update, getById, removeById, getBooksByFuzzySearch, getByIsbn } = require('../services/book.service');
const { getProfileById } = require('./../services/profile.service')
const { createBookSchema } = require('./../validations/createBookSchema')
const { updateBookSchema } = require('./../validations/updateBookSchema')
const { updateBookItem, getBookItemPossesedByUser } = require('./../services/bookItem.service')

const bookRouter = express.Router();

const {
    NotFoundError, 
    DatabaseError, 
    ForbiddenRequestError, 
    BadRequestError
} = require('./../errorHandling/errors');

const { Validator } = require('express-json-validator-middleware');
const { validate } = new Validator();
const { addDays } = require('./../../util/date')

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

bookRouter.get('/getBookItems/:id', authorization, async(req,res,next) => {
    try{
        if(!req.params.id) return next(new BadRequestError("book id is required "));
        
        const book = await getById(req.params.id);
        if(!book) return next(new NotFoundError("cannot find the book with the given id"));
        
        const bookItems = await book.getBookItems();
        const bookItemsResponse = [];

        for(let bookItem of bookItems){
            bookItemsResponse.push({
                id: bookItem.dataValues.id,
                status: bookItem.dataValues.status
            });    
        }

        res.send(bookItemsResponse);
    } catch (e) {
        console.log(e);
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
        console.log(e);
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
.post('/issue',
    authorization,
    (req, res, next) => {	
        if(req.user.role !== 'ADMIN') return next(new ForbiddenRequestError("request denied to issue a book"))
        return next();
    }, 
    async (req, res, next) => {
        try{
            const profile = await getProfileById(req.body.profileId);
            
            if(!profile) {
                return next(new NotFoundError("cannot find the profile with the given id"));
            }
            
            const book = await getById(req.body.bookId);
            const bookItems = await book.getBookItems();
            
            if(bookItems.length === 0) 
                return next(new NotFoundError("Book doesn't exist with the given id"));                
            
            let bookItemToLoan = null;

            for(const bookItem of bookItems){
                if(bookItem.dataValues.status == 'AVAILABLE'){
                    bookItemToLoan = bookItem;
                    break;
                }    
            }

            if(bookItemToLoan === null){
                return next(new NotFoundError("Book is not available currently to Loan"));
            }

            const borrowedDate = new Date();
            const dueDate = addDays(borrowedDate , 15);

            const fieldsToUpdate = {
                profileId : req.body.profileId,
                status : 'LOANED',
                borrowedDate : borrowedDate,
                dueDate : dueDate
            }

            const updatedBookItem = await updateBookItem(bookItemToLoan.dataValues.id, fieldsToUpdate);
            res.status(201).send("Book Issued Successfully");

        } catch (e) {
            console.log(e);
            return next(new DatabaseError("Internal Server Error"));
        }
    }
)

bookRouter
.post('/collect',
    authorization,
    (req, res, next) => {	
        if(req.user.role !== 'ADMIN') return next(new ForbiddenRequestError("request denied to issue a book"))
        return next();
    }, 
    async (req, res, next) => {
        try{
            
            console.log(req.body);
            
            const profile = await getProfileById(req.body.profileId);
            
            if(!profile) {
                return next(new NotFoundError("cannot find the user profile with the given id"));
            }
            
            const book = await getById(req.body.bookId);
            if(!book){
                return next(new NotFoundError("cannot find the book with the given id"));
            }

            const bookItems = await getBookItemPossesedByUser(req.body.bookId, req.body.profileId, "LOANED");
            
            if(bookItems.length === 0) 
                return next(new NotFoundError("User doesn't have a given book"));                
            
            const bookItem = bookItems[0];
            
            const fieldsToUpdate = {
                profileId : null,
                status : 'AVAILABLE',
                borrowedDate : null,
                dueDate : null
            }

            const updatedBookItem = await updateBookItem(bookItem.dataValues.id, fieldsToUpdate);
            res.status(201).send("Book Collected Successfully");
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

        if(!req.params.id){
            return next(new BadRequestError("book id is required"));
        }

        const book = await getById(req.params.id);
        const bookItems = await book.getBookItems();
        
        for(const bookItem of bookItems){
            if(bookItem.dataValues.status == 'LOANED'){
                return next(new ForbiddenRequestError("can't delete the book when bookItem is Loaned"));
            }
        }

        const response = await removeById(req.params.id);
        res.status(200).send("book successfully deleted");

    } catch (e) {
        return next(new DatabaseError("Internal Server Error"));
    }
})

module.exports = bookRouter

