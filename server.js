const { exception } = require('console');
const { validationData } = require("./validation");
const express = require('express');
const fs = require("fs");
const hostname = 'localhost';
var app = express();
app.use(express.json());
const port = 8081;
let articles= [];

const readFile =() =>{
    try {
        fs.readFile(`db.json`, function(error, data){
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

const createWriteStreamPromise = (file, article) => {       
    let articlesJson = fs.readFileSync(file,"utf-8");
    let articles = articlesJson ? JSON.parse(articlesJson): [];
    articles.push(article);
    articlesJson =  JSON.stringify(articles);
    fs.writeFileSync(file, articlesJson,"utf-8");
}

readFile();

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
            createWriteStreamPromise("db.json", newArticle);
            res.statusCode = 201;
            res.send(newArticle);
        }
        readFile();
    }).catch(err=> {
        createWriteStreamPromise("invalid.json", newArticle);
        res.statusCode = 400;
        res.send(err);
    });

    
});

app.listen(port, hostname, () =>{
    console.log(`Server running at http://${hostname}:${port}/`);
});


