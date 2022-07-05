const express = require('express');
const { authorization } = require('./../auth/authorization');
const { create, update, getById, getByUsername, removeById, removeByUsername } = require('./../services/librarian.service');

const librarianRouter = express.Router();

// librarianRouter.get('/', authorization, async (req, res) => {
//     try{

//     } catch (e) {

//     }
// })


// librarianRouter.get('/:id', authorization, async (req , res) => {
//     try{
//         const librarian = await getById(req.params.id);
//         if(!librarian) {
//             res.status(404).send("cannot find the librarian profile with the given librarian id");
//         }
//         const resbody = librarian.dataValues;
//         res.status(200).send(resbody);
//     } catch (e) {
//         throw e;
//     }
// })

librarianRouter.post('/', authorization, async (req, res) => {
    try{
        // if(req.user.role !== 'ADMIN'){
        //     res.status(403).send();
        // }
        // console.log('after');
        const librarian = await create(req.body);
        // connect with account
        // pass account id in the body
        res.status(201).send({id : librarian.dataValues.id});
    } catch (e) {
        res.status(400).send(e.message);
    }
})

// librarianRouter.put('/:id', authorization, async (req,res) => {
//     const fieldsToUpdate = {
//         name,
//         contact,
//         email
//     } = req.body

//     for (const [key, value] of Object.entries(fieldsToUpdate)) {
//         if(fieldsToUpdate[key] === undefined || fieldsToUpdate[key] === null){
//             delete fieldsToUpdate[key]
//         }
//     }

//     // also some validation in future checking datatypes and schema 

//     try{
//         const librarian = await update(req.params.id,fieldsToUpdate);
//         res.status(201).send(librarian);
//     } catch (e) {
//         res.status(400).send(e.message);
//     }
// })

// librarianRouter.delete('/:id', authorization, async (req, res) => {
//     try{
        
//     } catch (e) {

//     }
// })

// update only name, contact and email 

// user can't delete the profile because it is asscociated with bookItems
// admin can 

// get all the profiles is accessable by the admin 

module.exports = librarianRouter

