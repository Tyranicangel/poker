var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/list',function(req,res,next){
    models.Table.findAll({
        where:{
            status:{
                $ne:0
            }
        }
    }).then(function(tables){
        return res.json(tables);
    })
});

module.exports = router;