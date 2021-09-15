const Article = require("../../db/mongo/article");
const db = require('../../db/mongo');
const { validationDataArticle } = require("../../validation");
const router = require('express').Router();
const auth = require('../../middleware/authorization');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../log/logger');

const getArticle = async (id) =>{
    try {
        const article = await Article.findOne({id: id });
        return article;
    } catch (error) {
        console.log(error);
    }
}

const AddArticleToAuthor = async(authorId, articleId)=>{

    var author  = await db.models.Author.updateOne(
        { id: authorId},
        { $addToSet: { articles: [articleId] }}
    );
    return author;
};

const DeleteAuthorFromArticle = async(articleId)=>{
    const article = await getArticle(articleId);
    if(article)
    {
        await db.models.Author.updateOne(
            { id: article.authorId},
            { $pull: { articles: articleId } }
        );
    }
};

router.get('/', async (req, res)=>{
    logger.info(`${req.originalUrl} - ${req.method} - ${req.ip}`);
    const articles = await Article.find({});
    res.send(articles);
});

router.delete('/:id', auth.checkToken,auth.checkAdminrole, async (req, res) =>{
    logger.info(`${req.originalUrl} - ${req.method} - ${req.ip}`);
    const articleId = req.params.id;

    try {
        await DeleteAuthorFromArticle(articleId);
        Article.deleteOne({ id: articleId }).then((article) => {
            if (article.deletedCount === 1) 
            {
                return res.status(204).send();
            }
            else 
                return res.status(404).send();
            
        });
    } catch (error) {
        return res.status(400).send({error: error.message});
    }
});

router.get('/:id', async (req, res)=>{
    logger.info(`${req.originalUrl} - ${req.method} - ${req.ip}`);
    const id = req.params.id;
    const article = await getArticle(id);
    if(article === null) res.status(404);

    res.send(article);
});

router.post('/',auth.checkToken, (req, res) => {
    logger.info(`${req.originalUrl} - ${req.method} - ${req.ip}`);
    validationDataArticle(req.body)
    .then((isValid)=> {
        if(isValid){      
            try {
                const authorId = req.body.authorId;
                req.body.id =  uuidv4();
                getAuthor(authorId).then((author) => {
                    if(author.length == 0) throw ("Author not found");

                    const articuleDb = new Article (req.body);
                    articuleDb.save().then((article) => {
                        AddArticleToAuthor(authorId,article.id);
                    });
                    res.status(201).send(articuleDb);
                }).catch((error) => { res.status(404).send({error: error })});
               
            } catch (error) {
                res.status(400).send({error: error.message })
            }
        }
    }).catch(err=> {
        res.status(400).send(err);
    });
});

router.put('/:id',auth.checkToken, (req, res)=>{
    logger.info(`${req.originalUrl} - ${req.method} - ${req.ip}`);
    const articleId = req.params.id;
    const query = { id: articleId};
    validationDataArticle(req.body)
    .then((isValid)=> {
        if(isValid){      
            Article.updateOne(query, req.body).then((article) =>{
                if (article.modifiedCount === 1) 
                    return res.status(200).send();
                else 
                    return res.status(404).send();
            });
        }
    }).catch(err=> {
        res.status(400).send(err);
    });
});

router.patch('/:id',async (req, res) => {
    logger.info(`${req.originalUrl} - ${req.method} - ${req.ip}`);
    const article = await getArticle(req.params.id);
    article.title = req.body.title;
    article.readMins = req.body.readMins;
    article.source = req.body.source;
    validationDataArticle(article)
    .then((isValid)=> {
        if(isValid){      
            const query = { id: req.params.id};
            Article.updateOne(query, req.body, {new: true}).then((article) => {
                if (!article) {
                    return res.status(404).send();
                }
                res.status(200).send();
            }).catch((error) => {
                res.status(500).send(error);
            })
        }
    }).catch(err=> {
        res.statusCode = 400;
        res.send(err);
    }); 
});

module.exports = router;