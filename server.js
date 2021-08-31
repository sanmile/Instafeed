const { exception } = require('console');
const express = require('express');
const fs = require("fs");
const hostname = 'localhost';
var app = express();
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
        let article;
        if(articles.length > 0)
        {
            article = articles.find(a => a.id == id);
            return article;
        }else throw ("article not found");
    } catch (error) {
        console.log(error);
    }
    
}
readFile();


app.get('/articles', (req, res)=>{
    res.send(articles);
});

app.get('/article', (req, res)=>{
    const id = req.query.id;
    const article = getArticle(id);
    res.send(article);
});

app.listen(port, hostname, () =>{
    console.log(`Server running at http://${hostname}:${port}/`);
});


