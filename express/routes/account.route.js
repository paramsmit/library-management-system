const { create, getById, getByUsername, removeById, removeByUsername } = require('./../services/account.service');
const express = require('express');
const jwt = require('jsonwebtoken')
const {authorization} = require('./../auth/authorization');

let accountRouter = express.Router();

accountRouter.get("/logout", authorization, async (req, res) => {
    res.clearCookie("access_token").status(200).send("Successfully logged out");
  });
  
accountRouter.get('/:id', authorization, async (req , res, next) => {
    try{
        const account = await getById(req.params.id);
        console.log(await account.getMember().dataValues);

        if(!account) {
            res.status(404).send("cannot find the account with the given user id");
        }
        const resbody = account.dataValues;
        delete resbody['role'];
        res.status(200).send(resbody);
    } catch (e) {
        throw e;
    }
})

accountRouter.post('/', async (req, res, next) => {
    try{
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
            next();
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
    
    // member can remove it
    // librarian can also remove it by getting the userid
    // before removing it, we have to check that if any book is pending or not owned by the user                                                                                                                                                                
    
    try{
        if(req.body.id){
            const response = await removeById(req.body.id);
            console.log(response);
            // don't know what will be the response of the delete operation 
            // so printed it. 
            // later implement this api
        } 
        else if(req.body.username) {
            const response = await removeByUsername(req.body.username);
            console.log(response);
        }
    } catch(e) {
        throw e;
    }
})

module.exports = accountRouter
