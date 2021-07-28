const { validationFile } = require('./validation')
const fs = require("fs");

try {
    const data = fs.readFileSync('article.json')
    const article = JSON.parse(data)
    validationFile(article);
    
} catch (error) {
    console.log(err)
    return
}
