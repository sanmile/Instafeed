const { validationData } = require("./validation");
const fsOptions = require("./fsOptions");
const express = require('express');
const fs = require("fs");
const hostname = 'localhost';
var app = express();
app.use(express.json());
const port = 8081;
let articles= [];
const readDb =() =>{
    try {
        fs.readFile('db.json', function(error, data){
            articles = JSON.parse(data);
        });    
    } catch (error) {
        console.log(error);
    }
}

const getArticle = (id) =>{
    try {
        let article = undefined;
        if(articles.length > 0)
        {
            article = articles.find(a => a.id == id);
        }

        return article;
    } catch (error) {
        console.log(error);
    }
}

readDb();

app.get('/articles', (req, res)=>{
    res.send(articles);
});

app.get('/article', (req, res)=>{
    const id = req.query.id;
    let article = getArticle(id);
    if(!article)
    { 
        article = {};   
        res.statusCode = 404     
    }

    res.send(article);
});

app.post('/article', (req, res) => {
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
        console.log(isValid);
        if(isValid){
            fsOptions.createWriteStreamPromise("db.json", newArticle);
            res.statusCode = 201;
            res.send(newArticle);
        }
        readDb();
    }).catch(err=> {
        fsOptions.createWriteStreamPromise("invalid.json", newArticle);
        res.statusCode = 400;
        res.send(err);
    });

    
});

app.listen(port, hostname, () =>{
    console.log(`Server running at http://${hostname}:${port}/`);
});


