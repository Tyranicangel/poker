const models = require("../models");
const ranking = require("./rankPoker");

const {
  holdEm,
  distribute
} = ranking;


const concatcards=(str,item)=>{
  return str+item['Card.spriteX']+item['Card.spriteY']+" ";
}

const decideWinner = gameId=>{
  models.GameCard.findAll({
    where:{
      GameId:gameId
    },
    include:{
      model:models.Card
    },
    raw:true
  }).then(gamecards=>{
    gamelist=gamecards.reduce(concatcards,"").slice(0,-1);
    models.GameUser.findAll({
      where:{
        GameId:gameId
      },
      raw:true
    }).then(gameusers=>{
      alist=[];
      for(i=0;i<gameusers.length;i++){
        alist.push(models.UserCard.findAll({
          where:{
            GameUserId:gameusers[i]['id']
          },
          include:{
            model:models.Card
          },
          raw:true
        }));
      }
      Promise.all(alist).then(dat=>{
        eval=[gamelist,[]];
        for(i=0;i<dat.length;i++){
          gameusers[i]['PlayerCards']=dat[i].reduce(concatcards,"").slice(0,-1);
          eval[1].push(gameusers[i]['PlayerCards']);
        }
        evaluated=holdEm(eval[0],eval[1]);
        plist=[];
        for(i=0;i<gameusers.length;i++){
          gameusers[i]['eval']=evaluated[i];
          plist.push(models.UserPlay.sum("betAmount",{
            where:{
              GameUserId:gameusers[i]['id']
            }
          }));
        }
        Promise.all(plist).then(sums=>{
          for(i=0;i<sums.length;i++){
            gameusers[i]['totalbet']=sums[i];
          }
          distribute(gameusers);
        })
      });
    });
  });
}

const getGameUsers = gameId => {
  return models.GameUser.findAll({
    where: {
      GameId: gameId
    },
    order: [["id", "DESC"]],
    include: {
      model: models.TableUser
    },
    raw: true
  });
};

const getGameUserPlays = userIds => {
  return models.UserPlay.findAll({
    where: {
      playType: 3,
      id: userIds
    },
    order: [["id", "DESC"]]
  });
};

const updateGameContext = gameContext => {
  const { game, newgameusers, lastraised } = gameContext;
  let { statusflag, j } = gameContext;
  let currentflag = false;
  let noofusers = 0;
  while (j <= newgameusers.length) {
    if (currentflag) {
      if (newgameusers[j]["id"] == lastraised || newgameusers[j]["isCurrent"]) {
        if (noofusers == 1) {
          statusflag = "end";
          break;
        } else {
          if (game.status == 4) {
            statusflag = "end";
          } else {
            statusflag = "next";
          }
          break;
        }
      } else {
        if (newgameusers[j]["status"] != 0) {
          if (newgameusers[j]["status"] == 1) {
            statusflag = "current";
            break;
          } else if (lastraised != -1) {
            statusflag = "current";
            break;
          }
        }
      }
    } else {
      if (newgameusers[j]["isCurrent"]) {
        currentflag = true;
      }
    }
    if (newgameusers[j]["status"] != 0) {
      noofusers++;
    }
    j = (j + 1) % newgameusers.length;
  }
  gameContext.j = j;
  gameContext.statusflag = statusflag;
  return gameContext;
};

const resetIsCurrentForGame = gameId => {
  return models.GameUser.update(
    {
      isCurrent: false
    },
    {
      where: {
        GameId: gameId,
        isCurrent: true
      }
    }
  );
};

const setAsCurrentPlayer = (userId, gameId) => {
  return models.GameUser.update(
    {
      isCurrent: true
    },
    {
      where: {
        GameId: gameId,
        id: userId
      }
    }
  );
};

module.exports = {
  getGameUsers,
  getGameUserPlays,
  updateGameContext,
  resetIsCurrentForGame,
  setAsCurrentPlayer,
  decideWinner
};
