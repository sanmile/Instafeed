const { validationData } = require("./validation")
const fsOptions = require("./fsOptions");
const path = 'articles';
try {

    fsOptions.readDirectory.then(articles => {
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
                                fsOptions.createWriteStreamPromise("db.json", article);
                            }else{
                                fsOptions.createWriteStreamPromise("invalid.json", article);
                            }
                        }).catch(err=> {
                            console.log(err);
                            fsOptions.reateWriteStreamPromise("invalid.json", article);
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
