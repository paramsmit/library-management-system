const express = require('express');
const { authorization } = require('../auth/authorization');
const { create, update, getById, getByAccountId } = require('../services/profile.service');

const profileRouter = express.Router();

profileRouter.get('/', authorization, async (req, res) => {
    try{

    } catch (e) {

    }
})

profileRouter.get('/:accountId', authorization, async (req , res) => {
    try{
        const profile = await getByAccountId(req.params.accountId);
        if(!profile) {
            res.status(404).send("cannot find the profile with the given account id");
        }
        const resbody = profile.dataValues;
        res.status(200).send(resbody);
    } catch (e) {
        throw e;
    }
})

profileRouter.get('/getById/:id', authorization, async (req , res) => {
    try{

        // null check 
        const profile = await getById(req.params.id);
        if(!profile) {
            res.status(404).send("cannot find the profile with the given profile id");
        }
        const resbody = profile.dataValues;
        res.status(200).send(resbody);
    } catch (e) {
        throw e;
    }
})

profileRouter.post('/', authorization, async (req, res) => {
    try{        
        const profile = await create(req.body);
        // connect with account
        // pass account id in the body
        res.status(201).send({id : profile.dataValues.id});
    } catch (e) {
        res.status(400).send(e.message);
    }
})

profileRouter.put('/:id', authorization, async (req,res) => {
    const fieldsToUpdate = {
        name,
        contact,
        email
    } = req.body

    for (const [key, value] of Object.entries(fieldsToUpdate)) {
        if(fieldsToUpdate[key] === undefined || fieldsToUpdate[key] === null){
            delete fieldsToUpdate[key]
        }
    }

    // also some validation in future checking datatypes and schema 

    try{
        const profile = await update(req.params.id,fieldsToUpdate);
        res.status(201).send(profile);
    } catch (e) {
        res.status(400).send(e.message);
    }
})

profileRouter.delete('/:id', authorization, async (req, res) => {
    try{
        
    } catch (e) {

    }
})

// update only name, contact and email 

// user can't delete the profile because it is asscociated with bookItems
// admin can 

// get all the profiles is accessable by the admin 

module.exports = profileRouter

