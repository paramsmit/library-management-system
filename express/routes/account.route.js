const { create, getById, getByUsername, removeById } = require('./../services/account.service');
const express = require('express');
const jwt = require('jsonwebtoken')
const { authorization } = require('./../auth/authorization');
const { Validator } = require('express-json-validator-middleware');
const { validate } = new Validator();
const { createAccountSchema } = require('./../validations/createAccountSchema')
const { loginAccountSchema } = require('../validations/loginAccountSchema')

const {
    NotFoundError, 
    DatabaseError, 
    ForbiddenRequestError, 
    BadRequestError
} = require('./../errorHandling/errors');

const accountRouter = express.Router();

accountRouter.get("/logout", authorization, async (req, res) => {
    res.clearCookie("access_token").status(200).send("Successfully logged out");
});
  
accountRouter.get('/:id', authorization, async (req, res, next) => {
    try{
        const account = await getById(req.params.id);
        if(!account) {
            return next(new NotFoundError("cannot find the account with the given user id"));
        }
        const resbody = account.dataValues;
        // delete resbody['role'];
        res.status(200).send(resbody);
    } catch (e) {
        return next(new DatabaseError("Internal Server Error"));
    }
})

accountRouter.post('/', validate({ body : createAccountSchema }), async (req, res, next) => {
    try {
        const account = await create(req.body);
        res.status(201).send({id : account.dataValues.id});
    } catch (e) {
        return next(new DatabaseError("Internal Server Error"));
    }
})

accountRouter.post('/login', validate({body : loginAccountSchema}), async (req, res, next) => {
    try{
        const creds = {
            username : req.body.username,
            password : req.body.password
        }

        const account = await getByUsername(creds.username);
    
        if(!account){
            return next(new NotFoundError("can't find the user with the given username"));
        }

        const password = account.dataValues.password;
        
        if(creds.password !== password){
            return next(new ForbiddenRequestError("invalid password for the given user"));
        }

        const token = jwt.sign({ id: account.dataValues.id, role: account.dataValues.role }, "secret_key");
        
        res.cookie('access_token', token,  { expires: new Date(Date.now() + 3600000), httpOnly: true })
        .status(200)
        .send("logged in successfully");

    } catch (e) {
        return next(new DatabaseError("Internal Server Error"));
    }
})

accountRouter.delete('/remove/:id', authorization, async (req, res, next) => {

    // user and admin both can delete it for now

    try{
        if(!req.params.id){
            return next(new BadRequestError("account id is required"));
        }

        // not the most optimal code but can work for now
        const account = await getById(req.body.id)
        const profile = await account.getProfile();
        const bookItems = await profile.getBookItems();

        for(const bookItem of bookItems){
            if(bookItem.dataValues.status == 'LOANED'){
                return next(new ForbiddenRequestError("can't delete the account when owned the book"));
            }
        }
        
        const response = await removeById(req.body.id);
        // response seems like number of rows
        res.status(200).send("account deleted successfully");

    } catch(e) {
        return next(new DatabaseError("Internal Server Error"));
    }
})

module.exports = accountRouter
