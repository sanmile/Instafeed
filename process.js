const { validationData } = require("./validation")
const fs = require("fs");
const path = 'articles';
try {

    const readdir = new Promise((resolve, reject)=>{
        fs.readdir(path, function(error, articles){
            if(error) reject(error)
            else resolve(articles);
        });
    });

    const createWriteStreamPromise = (file, article) => {       
        const fs = require("fs");
        let articlesJson = fs.readFileSync(file,"utf-8");
        let articles = articlesJson ? JSON.parse(articlesJson): [];
        articles.push(article);
        articlesJson =  JSON.stringify(articles);
        fs.writeFileSync(file, articlesJson,"utf-8");
    }

    readdir.then(articles => {
        if(articles && Array.isArray(articles))
        {
            articles.forEach(function (articleFile){
                if(articleFile.endsWith('.json'))
                {
                    fs.readFile(`${path}/${articleFile}`, function(error, data){
                        const article = JSON.parse(data);
                        console.log(article);
                        validationData(article)
                        .then((isValid)=> {
                            console.log(isValid);
                            if(isValid){
                                createWriteStreamPromise("db.json", article);
                            }else{
                                createWriteStreamPromise("invalid.json", article);
                            }
                        }).catch(err=> {
                            console.log(err);
                            createWriteStreamPromise("invalid.json", article);
                        });
                    });
                }
            });
        }
    }).catch(err=> {console.log(err)});

} catch (error) {
    console.log(error)
    return
}
