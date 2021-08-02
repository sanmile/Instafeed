const { validationFile } = require("./validation")
const fs = require("fs");

try {
    const length = fs.readdirSync('articles').length
    for(let i = 1; i <= length; i++){
        const data = fs.readFileSync(`articles/article${i}.json`);
        const article = JSON.parse(data);
        const isValid = validationFile(article);
        
        if(isValid){
            const db = fs.createWriteStream("db.json", { flags: "a" });
            db.write(JSON.stringify(article));
            db.end();
        }else{
            const invalid = fs.createWriteStream("invalid.json", { flags: "a" });
            invalid.write(JSON.stringify(article));
            invalid.end();
        }
    }   
} catch (error) {
    console.log(error)
    return
}
