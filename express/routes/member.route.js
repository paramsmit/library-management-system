const express = require('express');
const { authorization } = require('./../auth/authorization');
const { create, update, getById, getByUsername, removeById, removeByUsername } = require('./../services/member.service');

const memberRouter = express.Router();

memberRouter.get('/', authorization, async (req, res) => {
    try{

    } catch (e) {

    }
})


memberRouter.get('/:id', authorization, async (req , res) => {
    try{
        const member = await getById(req.params.id);
        if(!member) {
            res.status(404).send("cannot find the member profile with the given member id");
        }
        const resbody = member.dataValues;
        res.status(200).send(resbody);
    } catch (e) {
        throw e;
    }
})

memberRouter.post('/', authorization, async (req, res) => {
    try{        
        const member = await create(req.body);
        // connect with account
        // pass account id in the body
        res.status(201).send({id : member.dataValues.id});
    } catch (e) {
        res.status(400).send(e.message);
    }
})

memberRouter.put('/:id', authorization, async (req,res) => {
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
        const member = await update(req.params.id,fieldsToUpdate);
        res.status(201).send(member);
    } catch (e) {
        res.status(400).send(e.message);
    }
})

memberRouter.delete('/:id', authorization, async (req, res) => {
    try{
        
    } catch (e) {

    }
})

// update only name, contact and email 

// user can't delete the profile because it is asscociated with bookItems
// admin can 

// get all the profiles is accessable by the admin 

module.exports = memberRouter

