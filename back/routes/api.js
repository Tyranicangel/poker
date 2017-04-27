const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require('../config');
const main = require('./main');
const user = require('./user');
const table = require('./table');

router.get('/',(req,res,next)=>{
	res.json(["Hello","World"]);
});

var auth=(req,res,next)=>{
	var token=req.body.token || req.query.token || req.headers['jwt-authtoken'];
	if(token){
		jwt.verify(token,config.salt,(err,decoded)=>{
			if(err){
				return res.status(401).send({
					success:false,
					message:'Unauthorized token'
				});
			}
			else{
				req.authdata=decoded;
				next();
			}
		});
	}
	else{
		return res.status(403).send({
			success:false,
			message:'No token provided'
		});
	}
}

router.use('/main',main);
router.use('/user',auth,user);
router.use('/table',auth,table);

module.exports = router;