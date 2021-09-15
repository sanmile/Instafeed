const router = require('express').Router();
const logger = require('../../log/logger');
const User = require('../../db/mongo/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/authorization');
const { v4: uuidv4 } = require('uuid');

router.post('/sessions', async (req, res, next) => {
    logger.info(`${req.originalUrl} - ${req.method} - ${req.ip}`);
    if(req.body.email && req.body.password){      
        try {
            const user = await User.findOne({email: req.body.email });
            if(user == null) res.status(404);
      
            bcrypt.compare(req.body.password, user.password, function(err, result) {
                if(result)
                {
                    const payload = {userId: user.id, role: user.role || ''};
                    const token = jwt.sign(
                        payload, 'miclaveultrasecreta123*', {
                        expiresIn: 2440
                        }
                    );
                    return res.json({
                        mensaje: 'Singined',
                        token: token
                    });
                }else return res.status(400).send({ error: "Incorret Password" });
            });
        } catch (error) {
            res.status(400).send({ error: error.message })
        }
    }else{
        res.status(400).send().statusMessage("Password and email are requried");
    }
});

router.get('/',  async (req, res)=>{
    logger.info(`${req.originalUrl} - ${req.method} - ${req.ip}`);
    try {
        const users = await User.find({});
        return res.send(users);    
    } catch (error) {
        return res.send(error.message);
    }
    
});

router.get('/:id', async (req, res)=>{
    logger.info(`${req.originalUrl} - ${req.method} - ${req.ip}`);
    const user = await User.findOne({id: req.params.id });
    if(user == null) res.status(404);

    return res.send(user);
});

router.post('/', auth.checkToken, async (req, res)=>{
    logger.info(`${req.originalUrl} - ${req.method} - ${req.ip}`);
    if(!req.params.email && !req.params.password){      
        try {
            const user = await User.findOne({email: req.body.email });
            if(!user)
            {
                req.body.id =  uuidv4();
                const userDb = new User (req.body);
                const saltRounds = 10;
                bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(req.body.password, salt, function(err, hash) {
                        userDb.password = hash;
                        userDb.save();
                        return res.status(201).send(userDb);
                    });
                });
            }else return res.status(400).send({ error: `Already exist an user with this email: ${req.body.email}` })
            
        } catch (error) {
           return res.status(400).send({ error: error.message })
        }
    }else{
        return res.status(400).send({error:"Password and email are requried"});
    }
    
});

router.delete('/:id',  auth.checkToken, auth.checkAdminrole, async (req, res) =>{
    logger.info(`${req.originalUrl} - ${req.method} - ${req.ip}`);
    const user = await User.deleteOne({ id: req.params.id });
    if (user.deletedCount === 1) 
        return res.status(204).send();
    else 
        return res.status(404).json({error:'user not found'});
});

module.exports = router;