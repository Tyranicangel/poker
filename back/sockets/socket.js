var io = require("socket.io")();
var models = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config");
const DBUtils = require("./utils");

io.set("origins", "*:*");

generateRandom = num => {
  let arr = [];
  while (arr.length < num) {
    let rnd = Math.ceil(Math.random() * 51);
    if (arr.indexOf(rnd) > -1) {
      continue;
    }
    arr.push(rnd);
  }
  return arr;
};

const {
  getGameUsers,
  getGameUserPlays,
  updateGameContext,
  resetIsCurrentForGame,
  setAsCurrentPlayer
} = DBUtils;

const updateGameStatus = tableId => {

  const gameContext = {
    newgameusers: [],
    j: 0,
    game: null,
    statusflag: "none",
    lastraised: -1
  }

  return models.Game
    .find({
      where: {
        status: { $ne: 0 },
        TableId: tableId
      }
    })
    .then(result => {
      gameContext.game = result;
      return getGameUsers(gameContext.game.id);
    })
    .then(gameusers => {
      gameusers.sort((a, b) => {
        return a["TableUser.position"] - b["TableUser.position"];
      });
      let i = 0;
      while (i < gameusers.length) {
        if (gameusers[i]["isBigBlind"]) {
          break;
        }
        i++;
      }
      const split = (i + 1) % gameusers.length;
      gameContext.newgameusers = gameusers.slice(split).concat(gameusers.slice(0, split));

      const {newgameusers} = gameContext;
      const oldstatus = gameContext.game.status;
      const userIds = [];
      for (i = 0; i < newgameusers.length; i++) {
        userIds.push(newgameusers[i]["id"]);
      }
      return getGameUserPlays(userIds);
    })
    .then(userPlays => {
      if (userPlays.length > 0) {
        gameContext.lastraised = userPlays[0].id;
      }

      updateGameContext(gameContext);
      
      const {game, statusflag, j, newgameusers} = gameContext;

      if (statusflag == "current") {
        return resetIsCurrentForGame(game.id).then(() => {
          const currentPlayerId = newgameusers[j]["id"];
          return setAsCurrentPlayer(currentPlayerId, game.id);
        }).then(() => {
          return getTableStatus(tableId);
        });
      } else if (statusflag == "next") {
        return resetIsCurrentForGame(game.id)
          .then(() => {
            return models.GameUser.update(
              {
                status: 1
              },
              {
                where: {
                  GameId: game.id,
                  status: { $ne: 0 }
                }
              }
            );
          })
          .then(() => {
            let q = 0;
            while (q < newgameusers.length) {
              if (newgameusers[q]["status"] != 0) {
                break;
              }
              q++;
            }
            const currentPlayerId = newgameusers[q]["id"];
            return setAsCurrentPlayer(currentPlayerId, game.id)
          })
          .then(() => {
            return game
              .update({
                status: game.status + 1,
                currentBet: 0
              })
          })
          .then(() => {
            return getTableStatus(tableId);
          });
      } else if (statusflag == "end") {
        console.log(`------ GAME END ------`);
        return game.update({ status: 0 })
        .then(newgame => {
          return checkGame(tableId);
        });
        //decide winner
      }
    });
};

let checkGame = tableId => {
  return models.Table
    .find({
      where: {
        id: tableId
      }
    })
    .then(table => {
      models.TableUser
        .findAll({
          where: {
            TableId: tableId,
            status: { $ne: 0 },
            $and: { status: { $ne: 10 } }
          },
          order: ["position"]
        })
        .then(tableusers => {
          if (tableusers.length > 1) {
            models.Game
              .findAll({
                where: {
                  TableId: tableId
                },
                order: [["id", "DESC"]],
                limit: 1,
                raw: true
              })
              .then(games => {
                if (games.length == 0) {
                  let cardList = generateRandom(5 + tableusers.length * 2);
                  models.Card.findAll({}).then(cards => {
                    models.Game
                      .create({
                        TableId: tableId,
                        currentBet: table.bigBlind,
                        order: ["id"]
                      })
                      .then(game => {
                        alist = [];
                        for (i = 0; i < 5; i++) {
                          alist.push(
                            models.GameCard.create({
                              GameId: game.id,
                              CardId: cards[cardList[i]].id
                            })
                          );
                        }
                        let startPos = 0;
                        for (i = 0; i < tableusers.length; i++) {
                          var counter = 4;
                          dealer = false;
                          smallBlind = false;
                          bigBlind = false;
                          current = false;
                          status = 1;
                          if (i == startPos % tableusers.length) {
                            dealer = true;
                          }
                          if (i == (startPos + 1) % tableusers.length) {
                            smallBlind = true;
                          }
                          if (i == (startPos + 2) % tableusers.length) {
                            bigBlind = true;
                          }
                          if (i == (startPos + 3) % tableusers.length) {
                            current = true;
                          }
                          alist.push(
                            models.GameUser
                              .create({
                                isSmallBlind: smallBlind,
                                isBigBlind: bigBlind,
                                isDealer: dealer,
                                isCurrent: current,
                                GameId: game.id,
                                status: status,
                                TableUserId: tableusers[i]["id"]
                              })
                              .then(gameuser => {
                                muser=null;
                                for(l=0;l<tableusers.length;l++){
                                  if(gameuser.TableUserId==tableusers[l]['id']){
                                    muser=tableusers[l];
                                  }                                      
                                }
                                if (gameuser.isSmallBlind) {
                                  alist.push(
                                    models.UserPlay.create({
                                      playType: 2,
                                      betAmount: table.smallBlind,
                                      GameUserId: gameuser.id
                                    })
                                  );
                                  alist.push(
                                      models.UserChip.findById(muser.UserId).then(uc=>{
                                        alist.push(
                                          uc.update({
                                            value:uc.value-table.smallBlind
                                          })
                                        )
                                      })
                                    )
                                    alist.push(
                                      models.TableUser.update({
                                        currentChips:muser.currentChips-table.smallBlind
                                      },{
                                        where:{
                                          id:muser.id
                                        }
                                      })
                                    )
                                }
                                if (gameuser.isBigBlind) {
                                  alist.push(
                                    models.UserPlay.create({
                                      playType: 2,
                                      betAmount: table.bigBlind,
                                      GameUserId: gameuser.id
                                    })
                                  );
                                  alist.push(
                                      models.UserChip.findById(muser.UserId).then(uc=>{
                                        alist.push(
                                          uc.update({
                                            value:uc.value-table.bigBlind
                                          })
                                        )
                                      })
                                    )
                                    alist.push(
                                      models.TableUser.update({
                                        currentChips:muser.currentChips-table.bigBlind
                                      },{
                                        where:{
                                          id:muser.id
                                        }
                                      })
                                    )
                                }
                                counter++;
                                alist.push(
                                  models.UserCard.create({
                                    GameUserId: gameuser.id,
                                    CardId: cards[cardList[counter]].id
                                  })
                                );
                                counter++;
                                alist.push(
                                  models.UserCard.create({
                                    GameUserId: gameuser.id,
                                    CardId: cards[cardList[counter]].id
                                  })
                                );
                              })
                          );
                        }
                        Promise.all(alist).then(data => {
                          getTableStatus(tableId);
                        });
                      });
                  });
                } else {
                  ogame = games[0];
                  let startPos = 0;
                  if (ogame["status"] == 0) {
                    models.GameUser
                      .find({
                        where: {
                          GameId: ogame.id,
                          isSmallBlind: true
                        },
                        include: {
                          model: models.TableUser
                        }
                      })
                      .then(gameuser => {
                        for (i = 0; i < tableusers.length; i++) {
                          if (
                            tableusers[i].position >=
                            gameuser.TableUser.position
                          ) {
                            startPos = i;
                          }
                        }
                      });
                    let cardList = generateRandom(5 + tableusers.length * 2);
                    models.Card.findAll({}).then(cards => {
                      models.Game
                        .create({
                          TableId: tableId,
                          currentBet: table.bigBlind,
                          order: ["id"]
                        })
                        .then(game => {
                          alist = [];
                          for (i = 0; i < 5; i++) {
                            alist.push(
                              models.GameCard.create({
                                GameId: game.id,
                                CardId: cards[cardList[i]].id
                              })
                            );
                          }
                          for (i = 0; i < tableusers.length; i++) {
                            var counter = 4;
                            dealer = false;
                            smallBlind = false;
                            bigBlind = false;
                            current = false;
                            status = 1;
                            if (i == startPos % tableusers.length) {
                              dealer = true;
                            }
                            if (i == (startPos + 1) % tableusers.length) {
                              smallBlind = true;
                            }
                            if (i == (startPos + 2) % tableusers.length) {
                              bigBlind = true;
                            }
                            if (i == (startPos + 3) % tableusers.length) {
                              current = true;
                            }
                            alist.push(
                              models.GameUser
                                .create({
                                  isSmallBlind: smallBlind,
                                  isBigBlind: bigBlind,
                                  isDealer: dealer,
                                  isCurrent: current,
                                  GameId: game.id,
                                  status: status,
                                  TableUserId: tableusers[i]["id"]
                                })
                                .then(gameuser => {
                                  muser=null;
                                  for(l=0;l<tableusers.length;l++){
                                    if(gameuser.TableUserId==tableusers[l]['id']){
                                      muser=tableusers[l];
                                    }                                      
                                  }
                                  if (gameuser.isSmallBlind) {
                                    alist.push(
                                      models.UserPlay.create({
                                        playType: 2,
                                        betAmount: table.smallBlind,
                                        GameUserId: gameuser.id
                                      })
                                    );
                                    alist.push(
                                      models.UserChip.findById(muser.UserId).then(uc=>{
                                        alist.push(
                                          uc.update({
                                            value:uc.value-table.smallBlind
                                          })
                                        )
                                      })
                                    )
                                    alist.push(
                                      models.TableUser.update({
                                        currentChips:muser.currentChips-table.smallBlind
                                      },{
                                        where:{
                                          id:muser.id
                                        }
                                      })
                                    )
                                  }
                                  if (gameuser.isBigBlind) {
                                    alist.push(
                                      models.UserPlay.create({
                                        playType: 2,
                                        betAmount: table.bigBlind,
                                        GameUserId: gameuser.id
                                      })
                                    );
                                    alist.push(
                                      models.UserChip.findById(muser.UserId).then(uc=>{
                                        alist.push(
                                          uc.update({
                                            value:uc.value-table.bigBlind
                                          })
                                        )
                                      })
                                    )
                                    alist.push(
                                      models.TableUser.update({
                                        currentChips:muser.currentChips-table.bigBlind
                                      },{
                                        where:{
                                          id:muser.id
                                        }
                                      })
                                    )
                                  }
                                  counter++;
                                  alist.push(
                                    models.UserCard.create({
                                      GameUserId: gameuser.id,
                                      CardId: cards[cardList[counter]].id
                                    })
                                  );
                                  counter++;
                                  alist.push(
                                    models.UserCard.create({
                                      GameUserId: gameuser.id,
                                      CardId: cards[cardList[counter]].id
                                    })
                                  );
                                })
                            );
                          }
                          Promise.all(alist).then(data => {
                            getTableStatus(tableId);
                          });
                        });
                    });
                  } else {
                    getTableStatus(tableId);
                  }
                }
              });
          } else {
            getTableStatus(tableId);
          }
        });
    });
};

let getTableStatus = tableId => {
  models.Table
    .find({
      where: {
        id: tableId
      },
      raw: true
    })
    .then(table => {
      models.TableUser
        .findAll({
          where: {
            TableId: tableId,
            status: { $ne: 0 },
            $and: { status: { $ne: 10 } }
          },
          order: ["position"],
          include: [
            {
              model: models.User,
              attributes: ["id", "username", "name", "avatar"]
            }
          ],
          raw: true
        })
        .then(tableusers => {
          tabusers = new Array(9);
          for (i = 0; i < tableusers.length; i++) {
            tabusers[tableusers[i].position - 1] = tableusers[i];
          }
          table.tableusers = tabusers;
          models.Game
            .find({
              where: {
                status: { $ne: 0 },
                TableId: table["id"]
              },
              include: {
                model: models.GameUser
              }
            })
            .then(game => {
              if (game) {
                table.game = game;
                alist = [];
                k = 0;
                while (k < table.tableusers.length) {
                  if (table.tableusers[k]) {
                    alist.push(
                      models.GameUser.find({
                        where: {
                          TableUserId: table.tableusers[k]["id"],
                          GameId: table.game.id
                        },
                        raw: true
                      })
                    );
                  }
                  k++;
                }
                Promise.all(alist).then(data => {
                  counter = 0;
                  plist = [];
                  for (i = 0; i < table.tableusers.length; i++) {
                    if (table.tableusers[i]) {
                      table.tableusers[i]["gameuser"] = data[counter];
                      counter++;
                      plist.push(
                        models.UserPlay.findAll({
                          where: {
                            GameUserId: table.tableusers[i]["gameuser"]["id"],
                            gameStatus: table.game.status
                          },
                          order: [["id", "DESC"]],
                          limit: 1,
                          raw: true
                        })
                      );
                    }
                  }
                  Promise.all(plist).then(dat => {
                    counter = 0;
                    for (i = 0; i < table.tableusers.length; i++) {
                      if (table.tableusers[i]) {
                        if (dat[counter].length > 0) {
                          table.tableusers[i]["userplay"] = dat[counter][0];
                        }
                        counter++;
                      }
                    }
                    models.GameCard
                      .findAll({
                        where: {
                          GameId: table.game.id
                        },
                        include: {
                          model: models.Card
                        },
                        order: ["id"],
                        raw: true
                      })
                      .then(gamecards => {
                        if (game.status == 1) {
                          table.gamecards = [];
                        } else if (game.status == 2) {
                          table.gamecards = [
                            gamecards[0],
                            gamecards[1],
                            gamecards[2]
                          ];
                        } else if (game.status == 3) {
                          table.gamecards = [
                            gamecards[0],
                            gamecards[1],
                            gamecards[2],
                            gamecards[3]
                          ];
                        } else if (game.status == 4) {
                          table.gamecards = gamecards;
                        }
                        sendUserInfo(tableId);
                        io.to(tableId).emit("table:status", table);
                      });
                  });
                });
              } else {
                sendUserInfo(tableId);
                io.to(tableId).emit("table:status", table);
              }
            });
        });
    });
};

let sendUserInfo = tableId => {
  models.Game
    .find({
      where: {
        TableId: tableId,
        status: { $ne: 0 }
      }
    })
    .then(game => {
      if (game) {
        models.GameUser
          .findAll({
            where: {
              GameId: game.id
            },
            raw: true,
            include: {
              model: models.TableUser,
              include: {
                model: models.User,
                include: {
                  model: models.UserChip
                }
              }
            }
          })
          .then(gameuser => {
            gameuser.forEach(function(element) {
              models.UserCard
                .findAll({
                  where: {
                    GameUserId: element["id"]
                  },
                  include: {
                    model: models.Card
                  },
                  raw: true
                })
                .then(usercard => {
                  element["cards"] = usercard;
                  if (element["isCurrent"]) {
                    models.UserPlay
                      .findAll({
                        where: {
                          gameStatus: game.status,
                          GameUserId: element["id"]
                        },
                        order: [["id", "DESC"]]
                      })
                      .then(play => {
                        element["minBet"] = game.currentBet - getSum(play);
                        io
                          .to(tableId)
                          .emit(
                            "user:status:" + element["TableUser.UserId"],
                            element
                          );
                      });
                  } else {
                    io
                      .to(tableId)
                      .emit(
                        "user:status:" + element["TableUser.UserId"],
                        element
                      );
                  }
                });
            }, this);
          });
      }
    });
};

let getSum = playList => {
  sum = 0;
  for (i = 0; i < playList.length; i++) {
    sum += playList[i]["betAmount"];
  }
  return sum;
};

let getTableGame = tableId => {
  return models.Game.find({
    where: {
      TableId: tableId,
      status: { $ne: 0 }
    }
  });
};

io.on("connection", socket => {
  let tableId = socket.handshake.query.tableId;
  let token = socket.handshake.query.userToken;
  jwt.verify(token, config.salt, (err, decoded) => {
    if (err) {
    } else {
      socket._userId = decoded.id;
      socket._tableId = tableId;
      socket.join(tableId);
      socket.emit("auth", { userId: decoded.id });
      models.TableUser
        .find({
          where: {
            TableId: socket._tableId,
            UserId: socket._userId,
            status: {
              $ne: 2
            }
          }
        })
        .then(dat => {
          if (!dat) {
            models.TableUser
              .create({
                TableId: socket._tableId,
                UserId: socket._userId
              })
              .then(tableuser => {
                socket._tableUserId = tableuser.id;
              });
              models.User.findById(socket._userId).then(data => {
                models.TableUser
                  .findAll({
                    where: {
                      status: { $ne: 2 }
                    },
                    include: [
                      {
                        model: models.User,
                        attributes: ["id", "username", "name", "avatar"]
                      }
                    ]
                  })
                  .then(tableusers => {
                    getTableStatus(socket._tableId);
                    io
                      .to(socket._tableId)
                      .emit("chat:status", {
                        message: data.name + " has joined the lobby.",
                        tableusers: tableusers
                      });
                  });
              });
          } else {
            socket._tableUserId = dat.id;
            getTableStatus(socket._tableId);
          }
        });
    }
  });

  socket.on("sit",data=>{
      models.TableUser.find({
        where:{position:data.position,status:{$ne:10}}
      }).then(success=>{
        if(!success){
          models.TableUser.find({
            where:{
              TableId:socket._tableId,
              UserId:socket._userId,
            }
          }).then(tableuser=>{
            tableuser.update({status:1,buyIn:data.BuyIn,currentChips:data.BuyIn,position:data.position}).then(tableuserupdate=>{
              checkGame(socket._tableId);
            })
          })
        }
      })
    })

    socket.on("check",data=>{
      getTableGame(socket._tableId).then(game=>{
        models.GameUser.find({
          where:{
            GameId:game.id,
            TableUserId:socket._tableUserId
          }
        }).then(user=>{
          user.update({status:2}).then(d=>{
            models.UserPlay.create({
              playType:1,
              GameUserId:user.id,
              gameStatus:game.status
            }).then(dat=>{
              updateGameStatus(socket._tableId);
            })
          })
        })
      })
    })

    socket.on("call",data=>{
      getTableGame(socket._tableId).then(game=>{  
        models.GameUser.find({
          where:{
            GameId:game.id,
            TableUserId:socket._tableUserId
          },
          include:{
            model:models.TableUser
          }
        }).then(user=>{
          newchips=user.TableUser.currentChips-parseInt(data.bet);
          user.update({status:3}).then(d=>{
            models.TableUser.update({
              currentChips:newchips
            },{
              where:{
                id:user.TableUserId
              }
            }).then(trand=>{
              models.UserPlay.create({
                playType:2,
                betAmount:data.bet,
                GameUserId:user.id,
                gameStatus:game.status
              }).then(dat=>{
                models.UserChip.findById(user.TableUser.UserId).then(us=>{
                  us.update({
                    value:us.value-parseInt(data.bet)
                  }).then(nus=>{
                    updateGameStatus(socket._tableId);
                  })
                })
              })
            })
          })          
        })
      })
    })

    socket.on("raise",data=>{
      getTableGame(socket._tableId).then(game=>{  
        models.GameUser.find({
          where:{
            GameId:game.id,
            TableUserId:socket._tableUserId
          },
          include:{
            model:models.TableUser
          }
        }).then(user=>{
          newchips=user.TableUser.currentChips-parseInt(data.bet);
          user.update({status:4}).then(d=>{
            models.TableUser.update({
              currentChips:newchips
            },{
              where:{
                id:user.TableUserId
              }
            }).then(trand=>{
              models.UserPlay.create({
                playType:3,
                betAmount:data.bet,
                GameUserId:user.id,
                gameStatus:game.status
              }).then(dat=>{
                models.UserChip.findById(user.TableUser.UserId).then(us=>{
                  us.update({
                    value:us.value-parseInt(data.bet)
                  }).then(nus=>{
                    if(data.bet>game.currentBet){
                      game.increment({
                        currentBet:data.bet
                      }).then(gmaedat=>{
                        updateGameStatus(socket._tableId);
                      })
                    }
                    else{
                      updateGameStatus(socket._tableId);
                    }
                    // updateGameStatus(socket._tableId);
                  })
                })
              })
            })
          })          
        })
      })
      // getTableGame(socket._tableId).then(game=>{
      //   models.GameUser.find({
      //     where:{
      //       GameId:game.id,
      //       TableUserId:socket._tableUserId
      //     }
      //   }).then(user=>{
      //     user.update({status:4});
      //       models.UserPlay.create({
      //         playType:3,
      //         betAmount:data.bet,
      //         GameUserId:user.id,
      //         gameStatus:game.status
      //       }).then(dat=>{
      //         models.UserChip.decrement({
      //           value:data.bet
      //         },{
      //           where:{
      //             UserId:socket._userId
      //           }
      //         }).then(userchip=>{
      //           if(data.bet>game.cuurentBet){
      //             game.increment({
      //               currentBet:data.bet
      //             }).then(gmaedat=>{
      //               updateGameStatus(socket._tableId);
      //             })
      //           }
      //           else{
      //             updateGameStatus(socket._tableId);
      //           }
      //         })
      //       })
      //   })
      // })
    })

    socket.on("fold",data=>{
      getTableGame(socket._tableId).then(game=>{
        models.GameUser.find({
          where:{
            GameId:game.id,
            TableUserId:socket._tableUserId
          }
        }).then(user=>{
          user.update({status:0}).then(d=>{
            models.UserPlay.create({
              playType:4,
              GameUserId:user.id,
              gameStatus:game.status
            }).then(dat=>{
              updateGameStatus(socket._tableId)
            })
          })
        })
      })
    })

    socket.on("stand",data=>{
      getTableGame(socket._tableId).then(game=>{
        if(game){
          models.GameUser.find({
            where:{
              GameId:game.id,
              TableUserId:socket._tableUserId
            }
          }).then(user=>{
            if(user){
              user.update({status:0}).then(d=>{
                models.UserPlay.create({
                  playType:4,
                  GameUserId:user.id,
                  gameStatus:game.status
                }).then(dat=>{
                  models.TableUser.findById(socket._tableUserId).then(tableuser=>{
                    tableuser.update({status:0}).then(response=>{
                      updateGameStatus(socket._tableId)
                      getTableStatus(socket._tableId)
                    })
                  })
                })
              })  
            }
            else{
              models.TableUser.findById(socket._tableUserId).then(tableuser=>{
                tableuser.update({status:0}).then(response=>{
                  getTableStatus(socket._tableId)
                })
              })
            }
          })
        }
        else{
          models.TableUser.findById(socket._tableUserId).then(tableuser=>{
            tableuser.update({status:0}).then(response=>{
              getTableStatus(socket._tableId)
            })
          })
        }
      })
    })

    socket.on("leave",data=>{
      getTableGame(socket._tableId).then(game=>{
        if(game){
          models.GameUser.find({
            where:{
              GameId:game.id,
              TableUserId:socket._tableUserId
            }
          }).then(user=>{
            if(user){
              user.update({status:0}).then(d=>{
                models.UserPlay.create({
                  playType:4,
                  GameUserId:user.id,
                  gameStatus:game.status
                }).then(dat=>{
                  models.TableUser.findById(socket._tableUserId).then(tableuser=>{
                    tableuser.update({status:0}).then(response=>{
                      updateGameStatus(socket._tableId);
                      getTableStatus(socket._tableId);
                      socket.disconnect();
                    })
                  })
                })
              })  
            }
            else{
              models.TableUser.findById(socket._tableUserId).then(tableuser=>{
                tableuser.update({status:0}).then(response=>{
                  getTableStatus(socket._tableId);
                  socket.disconnect();
                })
              })
            }
          })
        }
        else{
          models.TableUser.findById(socket._tableUserId).then(tableuser=>{
            tableuser.update({status:0}).then(response=>{
              getTableStatus(socket._tableId);
              socket.disconnect();
            })
          })
        }
      })
    })

    socket.on("message",data=>{
      models.Chat.create({
        message:data.message,
        TableId:socket._tableId,
        TableUserId:socket._tableUserId
      }).then(dat=>{
        io.to(socket._tableId).emit("chat:message",{dat})
      })
    })
});

module.exports = io;