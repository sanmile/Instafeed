const { validationFile } = require("./validation")
const fs = require("fs");
const path = 'articles';
try {

    const promise = new Promise((resolve, reject)=>{
        fs.readdir(path, function(error, articles){
            if(error) reject(error)
            else resolve(articles);
        });
    });

    const createWriteStreamPromise = (file, article)=>{       
        const db = fs.createWriteStream(file, { flags: "a" });
        db.write(`,${JSON.stringify(article)}`);
        db.end();
    }

    promise.then(articles => {
        if(articles && Array.isArray(articles))
        {
            articles.forEach(function (articleFile){
                if(articleFile.endsWith('.json'))
                {
                    fs.readFile(`${path}/${articleFile}`, function(error, data){
                        const article = JSON.parse(data);
                        console.log(article);
                        validationFile(article)
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
