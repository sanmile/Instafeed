const { validationData } = require("./validation");
const Article = require("./db/mongo/article");
//const { MongoClient } = require("mongodb");
const fsOptions = require("./fsOptions");
const express = require('express');
const fs = require("fs");
require('./db/mongo')
const hostname = 'localhost';
var app = express();
app.use(express.json());
const port = 8081;

const getArticle = async (id) =>{
    try {
        const article = await Article.find({id: id });
        return article;
    } catch (error) {
        console.log(error);
    }
}

app.get('/articles', async (req, res)=>{
    const articles1 = await Article.find({});
    res.send(articles1);
  
});

app.get('/article', async (req, res)=>{
    const id = req.query.id;
    const article = await getArticle(id);
    if(article.length === 0) res.statusCode = 404     

    res.send(article);
});

app.post('/article',async (req, res) => {
    const {id, title, url, keywords, publishedAt,author, readMins, source, modifiedAt} = req.body;
    const newArticle = {
        id,
        title,
        url,
        keywords,
        publishedAt,
        author,
        readMins,
        source,
        modifiedAt
    }
   
    validationData(newArticle)
    .then((isValid)=> {
        if(isValid){      
            try {
                const articuleDb = new Article (newArticle);
                articuleDb.save();
                res.statusCode = 201;
                res.send(articuleDb);
            } catch (error) {
                res.status(400).send({ ok: false, error: error.message })
            }
        }
    }).catch(err=> {
        res.statusCode = 400;
        res.send(err);
    });
});

app.listen(port, hostname, () =>{
    console.log(`Server running at http://${hostname}:${port}/`);
});


