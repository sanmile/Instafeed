const Author = require("../../db/mongo/author");
const Article = require("../../db/mongo/article");
const { validationDataAuthor } = require("../../validation");
const router = require('express').Router();
const auth = require('../../middleware/authorization');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../log/logger');

const DeleteArticleFromAuthor = async(authorId)=>{
    const author = await getAuthor(authorId);
    if(author && author.articles.length > 0)
    {
        author.articles.forEach(article => {
         Article.deleteOne({ id: article }).then((result)=> console.log(result))
        });
    }
};

const getAuthor = async (id) =>{
    try {
        const author = await Author.findOne({id: id });
        return author;
    } catch (error) {
        console.log(error);
    }
}

router.get('/', async (req, res)=>{
    logger.info(`${req.originalUrl} - ${req.method} - ${req.ip}`);
    const authors = await Author.find({});
    res.send(authors);
});

router.get('/:id', async (req, res)=>{
    logger.info(`${req.originalUrl} - ${req.method} - ${req.ip}`);
    const author = await getAuthor(req.params.id);
    if(author == null) res.status(404);

    res.send(author);
});

router.post('/', auth.checkToken,async (req, res)=>{
    logger.info(`${req.originalUrl} - ${req.method} - ${req.ip}`);
    validationDataAuthor(req.body)
    .then((isValid)=> {
        if(isValid){      
            try {
                req.body.id =  uuidv4();
                const authorDb = new Author (req.body);
                authorDb.save();
                res.status(201).send(authorDb);
            } catch (error) {
                res.status(400).send({ error: error.message })
            }
        }
    }).catch(err=> {
        res.status(400).send(err);
    });
});

router.put('/:id',auth.checkToken, (req, res)=>{
    logger.info(`${req.originalUrl} - ${req.method} - ${req.ip}`);
    const query = { id: req.params.id};
    validationDataAuthor(req.body)
    .then((isValid)=> {
        if(isValid){      
            Author.updateOne(query, req.body).then((author) =>{
                if (author.modifiedCount === 1) 
                    return res.status(200).send();
                else 
                    return res.status(404).send();
            });
        }
    }).catch(err=> {
        res.status(400).send(err);
    });
});

router.delete('/:id',auth.checkToken, auth.checkAdminrole, async (req, res) =>{
    logger.info(`${req.originalUrl} - ${req.method} - ${req.ip}`);
    DeleteArticleFromAuthor( req.params.id );
    const author = await Author.deleteOne({ id: req.params.id });
    if (author.deletedCount === 1) 
        return res.status(204).send();
    else 
        return res.status(404).send();
});
module.exports = router;