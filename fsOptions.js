const fs = require("fs");

const readDirectory = ()=>{
    return new Promise((resolve, reject)=>{
        fs.readdir(path, function(error, articles){
            if(error) reject(error)
            else resolve(articles);
        });
    });
}

const createWriteStreamPromise = (file, article) => {       
    let articlesJson = fs.readFileSync(file,"utf-8");
    let articles = articlesJson ? JSON.parse(articlesJson): [];
    articles.push(article);
    articlesJson =  JSON.stringify(articles);
    fs.writeFileSync(file, articlesJson,"utf-8");
}

module.exports = {
    readDirectory,
    createWriteStreamPromise,
}