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
      id: array
    },
    order: [["id", "DESC"]]
  });
};

const getCurrentStatusFlag = (game, newgameusers) => {
  let currentflag = false;
  let statusflag = "none";
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
  return statusflag;
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

export {
  getGameUsers,
  getGameUserPlays,
  resetIsCurrentForGame,
  setAsCurrentPlayer
};
