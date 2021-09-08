const { validationDataArticle, validationDataAuthor } = require("./validation");
const Article = require("./db/mongo/article");
const Author = require("./db/mongo/author");
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('./db/mongo');
const { ar } = require("date-fns/locale");
const hostname = 'localhost';
var app = express();
app.use(express.json());
const port = 8081;

const getArticle = async (id) =>{
    try {
        const article = await Article.findOne({id: id });
        return article;
    } catch (error) {
        console.log(error);
    }
}

const getAuthor = async (id) =>{
    try {
        const author = await Author.findOne({id: id });
        return author;
    } catch (error) {
        console.log(error);
    }
}

app.get('/articles', async (req, res)=>{
    const articles = await Article.find({});
    res.send(articles);
});

app.delete('/articles/:id', async (req, res) =>{
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

app.get('/articles/:id', async (req, res)=>{
    const id = req.params.id;
    const article = await getArticle(id);
    if(article === null) res.status(404);

    res.send(article);
});

app.post('/articles', (req, res) => {
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

app.put('/articles/:id', (req, res)=>{
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

app.patch('/articles/:id',async (req, res) => {
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

app.get('/authors', async (req, res)=>{
    const authors = await Author.find({});
    res.send(authors);
});

app.get('/authors/:id', async (req, res)=>{
    const author = await getAuthor(req.params.id);
    if(author == null) res.status(404);

    res.send(author);
});

app.post('/authors', async (req, res)=>{
    validationDataAuthor(req.body)
    .then((isValid)=> {
        if(isValid){      
            try {
                req.body.id =  uuidv4();
                const authorDb = new Author (req.body);
                authorDb.save();
                res.status(201).send(authorDb);
            } catch (error) {
                res.status(400).send({ ok: false, error: error.message })
            }
        }
    }).catch(err=> {
        res.status(400).send(err);
    });
});

app.put('/authors/:id', (req, res)=>{
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

app.delete('/authors/:id', async (req, res) =>{
    DeleteArticleFromAuthor( req.params.id );
    const author = await Author.deleteOne({ id: req.params.id });
    if (author.deletedCount === 1) 
        return res.status(204).send();
    else 
        return res.status(404).send();
});

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

const DeleteArticleFromAuthor = async(authorId)=>{
    const author = await getAuthor(authorId);
    if(author && author.articles.length > 0)
    {
        author.articles.forEach(article => {
         Article.deleteOne({ id: article }).then((result)=> console.log(result))
        });
    }
};

app.listen(port, hostname, () =>{
    console.log(`Server running at http://${hostname}:${port}/`);
});


