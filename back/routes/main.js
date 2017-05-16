var express = require('express');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var config = require('../config');
var router = express.Router();

var models = require('../models');


router.post('/login',function(req,res,next){
	var user=req.body;
	user.password=crypto.createHash('sha256').update(req.body.password).digest('hex');
	models.User.findOne({
		where:{
			username:req.body.username,
			password:req.body.password
		}
	}).then(function(user){
		if(user){
			var token=jwt.sign({id:user.id,username:user.username,active:user.active},config.salt,{
				expiresIn: '24h'
			});
			if(user.isVerified){
				res.json(["Success",token]);
			}
			else{
				res.json(["Verify",token]);
			}
		}
		else{
			res.json(["Error","Invalid username or password"]);
		}
	});
});


router.put('/register',function(req,res,next){
	var user=req.body;
	models.User.findAll({
		where:{$or:[{username:req.body.username},{email:req.body.email}]}
	}).then(function(users){
		if(users.length==0){
			models.User.create({
				username:req.body.username,
				name:req.body.name,
				email:req.body.email,
				password:crypto.createHash('sha256').update(req.body.password).digest('hex'),
				verificationCode:Math.floor((Math.random()*899999) + 100001),
				isVerified:true
			}).then(function(user){
				models.UserChip.create({
					UserId:user.id,
					value:10000
				}).then(userchip=>{
					var token=jwt.sign({id:user.id,username:user.username,active:user.active},config.salt,{
						expiresIn: '24h'
					});
					return res.json(["Success",token]);
				});
			});
		}
		else{
			return res.json(["Error","Username or Email already in use."]);
		}
	})
	
})


module.exports = router;