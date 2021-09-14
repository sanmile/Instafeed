const { validationDataAuthor, validationDataArticle } = require("../validation");
const assert = require("assert");

describe("Valitation models",  function() {
  it("ValidationArticle - Successfully ", async function() {
        const article = {
            "title": "Understanding Node.js File System Module",
            "url": "https://levelup.gitconnected.com/understanding-node-js-file-system-module-b16da1e01949",
            "keywords": ["Nodejs", "Filesystem"],
            "modifiedAt": "06/24/2019",
            "publishedAt": "06/24/2019",
            "authorId": "Swathi Prasad",
            "readMins": 3,
            "source": "BLOG"
        }

        let result = await validationDataArticle(article);
        assert.equal(true, result);
    });


//   it("ValidationArticle - Author Is is required ", async function() {
//         const article = {
//             "title": "Promises in Node.js",
//             "url": "https://www.geeksforgeeks.org/promises-in-node-js/",
//             "keywords": ["JavaScript", "Async"],
//             "modifiedAt": "07/13/2019",
//             "publishedAt": "07/13/2019",
//             "authorId": "",
//             "readMins": 3,
//             "source": "BLOG"
//         }

//         console.log('hola ');
//         let result = await validationDataArticle(article);
//         console.log('hola ' + result);
//         assert.fail();
//     });
});

