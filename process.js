'use strict';
const fs = require('fs')
const yup = require('yup');

// module.exports = function (formats = 'mm/dd/yyyy') {
//     return date().transform(function (value, originalValue) {
//       // check to see if the previous transform already parsed the date
//       if (this.isType(value)) return value;
  
//       // the default coercion failed so let's try it with Moment.js instead
//       value = Moment(originalValue, formats);
  
//       // if it's valid return the date object, otherwise return an `InvalidDate`
//       return value.isValid() ? value.toDate() : new Date('');
//     });
//   };

const articleSchema = yup.object({
    id: yup.string().max(36).required(),
    title: yup.string().max(256).required(),
    url: yup.string().url(),
    keywords: yup.array(yup.string()).min(1).max(3),
    modifiedAt: yup.date().required(),
    publishedAt: yup.date().nullable(),
    author: yup.string().max(100).required(),
    readMins: yup.number().positive().min(1).max(10).required(),
    source: yup.string().required()
  });

// exports.validationFile = () => {
    try {
        const data = fs.readFileSync('article.json', 'utf8')
        articleSchema.validate(JSON.parse(data))
        .then(function (value) {
            console.log(value)
          })
        .catch(function (err) {
            err.name; // => 'ValidationError'
            err.errors; // => ['age must be a number']
            console.log(err.errors)
          });

        // articleSchema.isValid(JSON.parse(data))
        // .then(function (valid){
        //         console.log(valid)
        //         }
        //     );
        //console.log(value)
    } catch (error) {
        console.log(error)
    }
//}

//validationFile()

