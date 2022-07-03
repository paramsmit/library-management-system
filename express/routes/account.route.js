const { create, getById, getByUsername } = require('./../services/account.service');
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
        if(!account) {
            res.status(404).send("cannot find the acccount with the given user id");
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


module.exports = accountRouter
