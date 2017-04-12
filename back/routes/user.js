var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var models = require('../models');

router.post('/verify',function(req,res,next){
	user=req.authdata;
	models.User.findById(user.id).then(function(data){
		if(data.verificationCode==req.body.verifyCode){
			data.update({isVerified:true}).then(function(response){
				return res.json(['Success']);
			})
		}
		else{
			return res.json(['Error',"Wrong verification code"]);
		}
	});
});

router.get('/resend',function(req,res,next){
	user=req.authdata;
});

router.get('/details',function(req,res,next){
	user=req.authdata;
	models.User.findById(user.id,{attributes:['username','name','avatar']}).then(function(data){
		return res.json(data);
	})
});

module.exports = router;