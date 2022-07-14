const express = require('express');
const { authorization } = require('../auth/authorization');
const { create, update, getById, removeById } = require('../services/bookItem.service');

const addDays = (date, days) => {
    const newDate = new Date(date);
    return newDate.setDate(newDate.getDate() + days);
}

const bookItem = express.Router();

bookItem.get('/', authorization, async (req, res) => {
	try{
    } catch (e) {
    }
})

bookItem.get('/getById/:id', authorization, async (req , res) => {
    try{
        const bookItem = await getById(req.params.id);
        if(!bookItem) {
            res.status(404).send("cannot find the bookItem with the given id");
        }

        // check for bookId always

        const resbody = bookItem.dataValues;
        res.status(200).send(resbody);
    } catch (e) {
        throw e;
    }
})

bookItem.post('/', authorization, async (req, res) => {
    try{
            
			if(req.user.role !== 'ADMIN'){
				res.status(403).send();
				return;
			}

			// when creating new bootItem
			// dueDate and borrwedDate will be null and status will always be AVAILABLE            

        const bookItem = await create(req.body);
        res.status(201).send({id : bookItem.dataValues.id});
    } catch (e) {
        res.status(400).send(e.message);
    }
})

bookItem.put('/:id', authorization, async (req,res) => {

	if(req.user.role !== 'ADMIN'){
		res.status(403).send();
		return;
	}
    
    // const fieldsToUpdate = {
    //     "status" : "",
    //     "borrowedDate" : "" ,
    //     "dueDate" : "",
    //     "profileId" : req.body.profileId,
    //     "bookId": req.body.bookId
    // }

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

        default: 
            res.status(400).send();
            return;
    }

    try{
        const bookItem = await update(req.params.id,fieldsToUpdate);
        res.status(201).send(bookItem);
    } catch (e) {
        res.status(400).send(e.message);
    }
})

bookItem.delete('/:id', authorization, async (req, res) => {
    try{
        
        if(req.user.role !== 'ADMIN'){
            res.status(403).send();
            return;
        }

        const bookItem = await getById(id);
        const status = bookItem.dataValues.status;

        if(status === 'LOANED'){
            res.status(400).send("can't delete. book item is loaned.");
            return;
        }

        await removeById(id);
        res.status(200).send("book item removed successfully");

    } catch (e) {
        res.status(400).send(e.message);
    }
})

module.exports = bookItem
