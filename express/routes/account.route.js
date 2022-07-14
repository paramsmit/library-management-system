const { create, getById, getByUsername, removeById } = require('./../services/account.service');
const express = require('express');
const jwt = require('jsonwebtoken')
const {authorization} = require('./../auth/authorization');

const accountRouter = express.Router();

accountRouter.get("/logout", authorization, async (req, res) => {
    res.clearCookie("access_token").status(200).send("Successfully logged out");
});
  
accountRouter.get('/:id', authorization, async (req, res, next) => {
    try{
        const account = await getById(req.params.id);
        if(!account) {
            res.status(404).send("cannot find the account with the given user id");
        }
        const resbody = account.dataValues;
        // delete resbody['role'];
        res.status(200).send(resbody);
    } catch (e) {
        throw e;
    }
})

accountRouter.post('/', async (req, res, next) => {
    try {
        const account = await create(req.body);
        res.status(201).send({id : account.dataValues.id});
    } catch (e) {
        res.status(400).send(e.message);
    }
})

accountRouter.post('/login', async (req, res, next) => {
    try{
        const creds = {
            username : req.body.username,
            password : req.body.password
        }

        const account = await getByUsername(creds.username);
    
        if(!account){
            res.statusCode(403).send("can't find the user with the given username");
            next(); // or just return
        }

        const password = account.dataValues.password;
        
        if(creds.password !== password){
            res.statusCode(403).send("invalid password for the given user");
            next();
        }

        const token = jwt.sign({ id: account.dataValues.id, role: account.dataValues.role }, "secret_key");
        res.cookie('access_token', token,  { expires: new Date(Date.now() + 3600000), httpOnly: true }).status(200).send("logged in successfully");
        next();

    } catch (e) {
        res.status(403).send();
    }
})

accountRouter.delete('/remove', authorization, async (req,res) => {

    // user and admin both can delete it for now

    try{
        if(!req.body.id){
            res.status(400).send();
            return;
        }

        // not the most optimal code but can work for now
        const account = await getById(req.body.id)
        const profile = await account.getProfile();
        const bookItems = await profile.getBookItems();

        for(const bookItem of bookItems){
            if(bookItem.dataValues.status == 'LOANED'){
                res.status(403).send("can't delete the account when owned the book");
                return;
            }
        }
        
        const response = await removeById(req.body.id);
        // response seems like number of rows
        res.status(200).send("account deleted successfully");

    } catch(e) {
        throw e;
    }
})

module.exports = accountRouter
