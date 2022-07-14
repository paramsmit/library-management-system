const express = require('express');
const { authorization } = require('../auth/authorization');
const { create, update, getById } = require('../services/book.service');

const bookRouter = express.Router();

bookRouter.get('/', authorization, async (req, res) => {
	try{	
    } catch (e) {

    }
})

bookRouter.get('/getById/:id', authorization, async (req , res) => {
    try{
        const book = await getById(req.params.id);
        if(!book) {
            res.status(404).send("cannot find the profile with the given book id");
        }
        const resbody = book.dataValues;
        res.status(200).send(resbody);
    } catch (e) {
        throw e;
    }
})

bookRouter.get('/getByIsbn/:isbn', authorization, async (req , res) => {
    try{
        const book = await getByIsbn(req.params.isbn);
        if(!book) {
            res.status(404).send("cannot find the book with the given book isbn");
        }
        const resbody = book.dataValues;
        res.status(200).send(resbody);
    } catch (e) {
        throw e;
    }
})

bookRouter.get('/getByTitle/:title', authorization, async (req , res) => {
    try{
        const book = await getByTitle(req.params.title);
        if(!book) {
            res.status(404).send("cannot find the book with the given book id");
        }
        const resbody = book.dataValues;
        res.status(200).send(resbody);
    } catch (e) {
        throw e;
    }
})



bookRouter.post('/', authorization, async (req, res) => {
    try{
		
		if(req.user.role !== 'ADMIN'){
			res.status(403).send();
			return;
		}
		
        const book = await create(req.body);
        res.status(201).send({id : book.dataValues.id});
    } catch (e) {
        res.status(400).send(e.message);
    }
})

bookRouter.put('/:id', authorization, async (req,res) => {
	
	if(req.user.role !== 'ADMIN'){
		res.status(403).send();
		return;
	}

	const fieldsToUpdate = {
		isbn, 
		title,
		author,
		publisher,
		pageCount
    } = req.body

	const nonNullAbleFields = ["isbn", "title"];

	for(field in nonNullAbleFields){
		if(fieldsToUpdate[field] === null){
			res.status(400).send(field + ' must not be null in the request');
			return;
		}
	}

    for (const [key, value] of Object.entries(fieldsToUpdate)) {
        if(fieldsToUpdate[key] === undefined){
            delete fieldsToUpdate[key]
        }
    }

    try{
        const book = await update(req.params.id,fieldsToUpdate);
        res.status(201).send(book);
    } catch (e) {
        res.status(400).send(e.message);
    }
})

bookRouter.delete('/:id', authorization, async (req, res) => {
    try{
    } catch (e) {
    }
})

module.exports = bookRouter

