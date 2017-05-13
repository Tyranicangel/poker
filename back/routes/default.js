var express = require('express');
var router = express.Router();

var models = require('../models');

router.get('/card',(req,res,next)=>{
    const cardList=['A','2','3','4','5','6','7','8','9','T','J','Q','K'];
    const suitList=['C','D','H','S'];
    const cards=['Ace','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Jack','Queen','King'];
    const suits=['Clubs','Diamonds','Hearts','Spades'];
    for(i=0;i<13;i++){
        for(j=0;j<4;j++){
            models.Card.create({
                name:cardList[i]+suitList[j],
                value:cards[i],
                suit:suits[j],
                spriteX:cardList[i],
                spriteY:suitList[j]
            });
        }
    }
    res.json(["Hey"]);
})

module.exports = router;