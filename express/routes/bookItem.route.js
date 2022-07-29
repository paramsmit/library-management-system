const express = require('express');
const { authorization } = require('../auth/authorization');
const { create, update, getById, removeById } = require('../services/bookItem.service');

const { createBookItemSchema } = require('./../validations/createBookItemSchema');
const { updateBookItemSchema } = require('./../validations/updateBookItemSchema');

const { Validator } = require('express-json-validator-middleware');
const { validate } = new Validator();

const {
    NotFoundError, 
    DatabaseError, 
    ForbiddenRequestError, 
    BadRequestError
} = require('./../errorHandling/errors');

const addDays = (date, days) => {
    const newDate = new Date(date);
    return newDate.setDate(newDate.getDate() + days);
}

const bookItem = express.Router();

// implement when it is required

// bookItem.get('/', authorization, async (req, res) => {
//     try{} catch (e) {}
// })

bookItem.get('/getById/:id', authorization, async (req, res, next) => {
    try{

        if(!req.params.id){
            return next(new BadRequestError('required field id'));
        }

        const bookItem = await getById(req.params.id);
        
        if(!bookItem) {
            return next(new NotFoundError("cannot find the bookItem with the given id"));
        }

        // check for bookId always

        const resbody = bookItem.dataValues;
        res.status(200).send(resbody);
    } catch (e) {
        return next(new DatabaseError("Internal Server Error"));
    }
})

bookItem.
post('/', 
    authorization,
    validate({body : createBookItemSchema}),
    async (req, res, next) => {
        try{
                
            if(req.user.role !== 'ADMIN'){
                return next(new ForbiddenRequestError("request denied for create book item"))
            }

            const bookItem = await create(req.body);
            res.status(201).send({id : bookItem.dataValues.id});
        } catch (e) {
            return next(new DatabaseError("Internal Server Error"));
        }
    }
)

bookItem
.put('/:id', 
    authorization, 
    (req,res,next) => {
        if(req.user.role !== 'ADMIN'){
            return next(new ForbiddenRequestError("request denied for update book item"))
        }
        return next();
    },
    validate({body : updateBookItemSchema}),
    async (req, res, next) => {

    const fieldsToUpdate = {};

    switch (req.body.status) {
        
        // profileId can't be null here.

        // check the status before updating the item.
        // if lost then can't available
        // if lost then can't loan

        case 'LOANED':
            fieldsToUpdate.status = 'LOANED';
            fieldsToUpdate.borrowedDate = new Date();
            fieldsToUpdate.dueDate = addDays(fieldsToUpdate.borrowedDate, 15);
            fieldsToUpdate.profileId = req.body.profileId;
            break;

        case 'AVAILABLE':
            fieldsToUpdate.status = 'AVAILABLE';
            fieldsToUpdate.borrowedDate = null;
            fieldsToUpdate.dueDate = null;
            fieldsToUpdate.profileId = null;
            break;

        case 'LOST':
            fieldsToUpdate.status = 'LOST';
            fieldsToUpdate.borrowedDate = null;
            fieldsToUpdate.dueDate = null;
            fieldsToUpdate.profileId = null;
            break;
    }

    try{
        const bookItem = await update(req.params.id,fieldsToUpdate);
        res.status(201).send(bookItem);
    } catch (e) {
        return next(new DatabaseError("Internal Server Error"));
    }
})

bookItem.delete('/:id', authorization, async (req, res, next) => {
    try{
        
        if(req.user.role !== 'ADMIN'){
            return next(new ForbiddenRequestError("request denied for delete book item"))
        }

        const bookItem = await getById(id);
        const status = bookItem.dataValues.status;

        if(status === 'LOANED'){
            return next(new ForbiddenRequestError("can't delete. book item is loaned"))
        }

        await removeById(id);
        res.status(200).send("book item removed successfully");

    } catch (e) {
        return next(new DatabaseError("Internal Server Error"));
    }
})

module.exports = bookItem
