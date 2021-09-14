const jwt = require('jsonwebtoken');


module.exports.checkToken = (req, res, next) => {
    const authorization = req.get('Authorization');
    let token  = '';
    if(authorization && authorization.split(' ')[0] === 'Bearer') {
        token = authorization.split(' ')[1];

        jwt.verify(token, 'miclaveultrasecreta123*', (err, decoded)=>{
            if(err) return res.status(401).send(err.message || 'Faild');

            req.user = decoded;
            next();
        });
    }else{
      return  res.status(401).json({Error: 'Missing authorization header'})
    }
}


module.exports.checkAdminrole = (req, res, next) => {
    const {role } = req.user;
    if( role === 'ADMIN') {
        next();
    }else{
        res.status(401).json({Error: 'The user needs ADMIN role'})
    }
}