var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var config = require('../config');
var main = require('./main');
var user = require('./user');
var table = require('./table');

router.get('/',function(req,res,next){
	res.json(["Hello","World"]);
});

var auth=function(req,res,next){
	var token=req.body.token || req.query.token || req.headers['jwt-authtoken'];
	if(token){
		jwt.verify(token,config.salt,function(err,decoded){
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