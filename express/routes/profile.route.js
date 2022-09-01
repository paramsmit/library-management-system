const express = require('express');
const { authorization } = require('../auth/authorization');
const { create, update, getById, getByAccountId, removeById } = require('../services/profile.service');

const { createProfileSchema } = require('./../validations/createProfileSchema.js')
const { updateProfileSchema } = require('./../validations/updateProfileSchema.js')

const profileRouter = express.Router();

const {
    NotFoundError, 
    DatabaseError, 
    ForbiddenRequestError, 
    BadRequestError
} = require('./../errorHandling/errors');

const { Validator } = require('express-json-validator-middleware');
const { validate } = new Validator();

// profileRouter.get('/', authorization, async (req, res) => {
//     try{} catch (e) {}
// })

profileRouter
.get('/:accountId',
    authorization, 
    async (req, res, next) => {
        
        if(!req.params.accountId){
            return next(new BadRequestError('accountId of profile is required'));
        }
        
        try{
            const profile = await getByAccountId(req.params.accountId);
            if(!profile) {
                return next(new NotFoundError("cannot find the profile with the given account id"));
            }
            const resbody = profile.dataValues;
            res.status(200).send(resbody);
        } catch (e) {
            return next(new DatabaseError("Internal Server Error"));
        }
    }
)

profileRouter
.get('/getById/:id', 
    authorization, 
    async (req, res, next) => {
        try{
            
            if(!req.params.id) {
                return next(new BadRequestError('profile id is required'));
            }

            // null check 
            const profile = await getById(req.params.id);
            if(!profile) {
                return next(new NotFoundError("cannot find the profile with the given id"));
            }
            const resbody = profile.dataValues;
            res.status(200).send(resbody);
        } catch (e) {
            return next(new DatabaseError("Internal Server Error"));
        }
    }
)

profileRouter
.post('/', 
    authorization, 
    validate({body : createProfileSchema}),
    async (req, res, next) => {
        try{        
            const profile = await create(req.body);
            // connect with account
            // pass account id in the body
            res.status(201).send({id : profile.dataValues.id});
        } catch (e) {
            console.log(e);
            return next(new DatabaseError("Internal Server Error"));
        }
    }
)

profileRouter
.put('/:id', 
    authorization, 
    validate({body: updateProfileSchema}),
    async (req, res, next) => {
        const fieldsToUpdate = {
            name,
            contact,
            email
        } = req.body

        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            if(fieldsToUpdate[key] === undefined){
                delete fieldsToUpdate[key]
            }
        }

        try{
            const profile = await update(req.params.id, fieldsToUpdate);
            console.log(profile);
            res.status(201).send(profile);
        } catch (e) {
            return next(new DatabaseError("Internal Server Error"));
        }
    }
)

profileRouter.delete('/:id', authorization, async (req, res, next) => {
    try{

        if(!req.params.id){
            return next(new BadRequestError('required profile id'));
        }

        const profile = await getById(req.params.id);
        if(!profile){
            return next(new NotFoundError('profile with the given id not found'));
        }

        const bookItems = await profile.getBookItems();

        for(const bookItem of bookItems){
            if(bookItem.dataValues.status == 'LOANED'){
                return next(new ForbiddenRequestError("can't delete the account when owned the book"))
            }
        }
        
        const response = await removeById(req.params.id);
        res.status(200).send("profile deleted successfully");
    } catch (e) {
        return next(new DatabaseError("Internal Server Error"));
    }
})

// update only name, contact and email 

// user can't delete the profile because it is asscociated with bookItems
// admin can 

// get all the profiles is accessable by the admin 

module.exports = profileRouter

