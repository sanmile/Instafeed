const yup = require("yup");
const { parse, isDate } = require("date-fns");

function parseDateString(value, originalValue) {
  originalValue = originalValue === "" ? null : originalValue;
  let parsedDate = originalValue;
  if (originalValue !== null){
    parsedDate = isDate(originalValue)
    ? originalValue
    : parse( originalValue, 'MM/dd/yyyy', new Date());
  }
  return parsedDate;
}

let lastDay = new Date().setDate(new Date().getDate() - 1);
lastDay = new Date(lastDay);

const articleSchema = yup.object({
    title: yup.string().max(256).required(),
    url: yup.string().url().when('publishedAt',{
      is: null,
      then: yup.string().url().nullable(),
      otherwise: yup.string().url().required()
    }),
    keywords: yup.array(yup.string()).min(1).max(3),
    modifiedAt: yup.date().transform(parseDateString).max(lastDay).required(),
    publishedAt: yup.date().nullable().max(lastDay).transform(parseDateString),
    authorId: yup.string().max(100).required(),
    readMins: yup.number().positive().min(1).max(20).required(),
    source: yup.mixed().oneOf(['ARTICLE',  'BLOG', 'TWEET', 'NEWSPAPER']).required()
  });

  const authorSchema = yup.object({
    name: yup.string().max(256).required(),  
    articles: yup.array(yup.string()),
  });

const  validationDataArticle = (data) => {
    return new Promise((resolve, reject) => {
    articleSchema.validate(data)
    .then(() => {resolve (true)})
    .catch((error) => {
        if(error.name === 'ValidationError'){
          reject(`${error.name}: ${error.errors}`)
        }
      });
    });
}

const  validationDataAuthor = (data) => {
  return new Promise((resolve, reject) => {
    authorSchema.validate(data)
  .then(() => {resolve (true)})
  .catch((error) => {
      if(error.name === 'ValidationError'){
        reject(`${error.name}: ${error.errors}`)
      }
    });
  });
}

module.exports = {
  validationDataArticle,
  validationDataAuthor
}
