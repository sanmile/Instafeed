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

// const author = yup.object({
//   id: yup.string(),
//   name:yup.string().max(100).required(),
//   articules: yup.array(yup.string()).nullable
// });

let lastDay = new Date().setDate(new Date().getDate() - 1);
lastDay = new Date(lastDay);

const articleSchema = yup.object({
    id: yup.string().max(36).required(),
    title: yup.string().max(256).required(),
    url: yup.string().url().when('publishedAt',{
      is: null,
      then: yup.string().url().nullable(),
      otherwise: yup.string().url().required()
    }),
    keywords: yup.array(yup.string()).min(1).max(3),
    modifiedAt: yup.date().transform(parseDateString).max(lastDay).required(),
    publishedAt: yup.date().nullable().max(lastDay).transform(parseDateString),
    author: yup.string().max(100).required(),
    //author: yup.object(author).required(),
    readMins: yup.number().positive().min(1).max(20).required(),
    source: yup.mixed().oneOf(['ARTICLE',  'BLOG', 'TWEET', 'NEWSPAPER']).required()
  });

const  validationData = (data) => {
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

module.exports = {
  validationData
}
