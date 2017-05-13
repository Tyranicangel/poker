var io = require("socket.io")();
var models = require("../models");
const jwt = require('jsonwebtoken');
const config = require('../config');

// const { Chat } = models;

io.set("origins", "*:*");

generateRandom=(num)=>{
  let arr=[];
  while(arr.length<num){
    let rnd=Math.ceil(Math.random()*51);
    if(arr.indexOf(rnd)>-1){continue}
    arr.push(rnd);
  }
  return arr;
}

updateGameStatus=(tableId)=>{
  models.Game.find({
      where:{
        status:{$ne:0},
        TableId:tableId
      }
    }).then(game=>{
      models.GameUser.findAll({
        where:{
          GameId:game.id
        },
        order:[['id','DESC']],
        include:{
          model:models.TableUser
        },
        raw:true
      }).then(gameusers=>{
        gameusers.sort((a,b)=>{return a['TableUser.position']-b['TableUser.position']});
        i=0;
        while(i<gameusers.length){
          if(gameusers[i]['isBigBlind']){
            break; 
          }
          i++;
        }
        split=(i+1)%gameusers.length;
        newgameusers=gameusers.slice(split).concat(gameusers.slice(0,split));
        oldstatus=game.status;
        var j=0;
        var statusflag="none";
        var currentflag=false;
        var lastraised=-1;
        var noofusers=0;
        var array=[];
        for(i=0;i<newgameusers.length;i++){
          array.push(newgameusers[i]['id']);
        }
        models.UserPlay.findAll({
          where:{
            playType:3,
            id:array
          },
          order:[['id','DESC']]
        }).then(uplay=>{
          if(uplay.length>0){
            lastraised=uplay[0].id;
          }
          while(j<=newgameusers.length){
            if(currentflag){
              if(newgameusers[j]['id']==lastraised || newgameusers[j]['isCurrent']){
                if(noofusers==1){
                  statusflag="end";
                  break;
                }
                else{
                  if(game.status==3){
                    statusflag="end";
                  }
                  else{
                    statusflag="next";
                  }
                  break;
                }
              }
              else{
                if(newgameusers[j]['status']!=0){
                   if(newgameusers[j]['status']==1){
                      statusflag="current";
                      break;
                   }
                  else if(lastraised!=-1){
                    statusflag="current";
                    break;
                  }
                }
              }
            }
            else{
              if(newgameusers[j]['isCurrent']){
                currentflag=true;
              }
            }
            if(newgameusers[j]['status']!=0){
              noofusers++;
            }
            j=(j+1)%newgameusers.length;
          }
          if(statusflag=="current"){
            models.GameUser.update(
              {
                isCurrent:false
              },
              {
                where:{
                  GameId:game.id,
                  isCurrent:true
                }
              }).then(u=>{
              models.GameUser.update({
                  isCurrent:true,
                },
                {
                  where:{
                    id:newgameusers[j]['id']
                  }
              }).then(dummy=>{
                getTableStatus(tableId);
              })
            })
          }
          else if(statusflag=="next"){
            models.GameUser.update(
              {
                isCurrent:false
              },
              {
                where:{
                  GameId:game.id,
                  isCurrent:true
                }
              }).then(u=>{
              models.GameUser.update(
                {
                  status:1
                },
                {
                  where:{
                    GameId:game.id
                  }
                }
              ).then(u1=>{
                models.GameUser.update({
                    isCurrent:true,
                  },
                  {
                    where:{
                      id:newgameusers[0]['id']
                    }
                }).then(dummy=>{
                  game.update({
                    status:game.status+1,
                    currentBet:0
                  }).then(gdata=>{
                    getTableStatus(tableId);
                  })
                })
              })
            })
          }
          else if(statusflag=="end"){
            console.log("end");
          }
        });
      })
    })
  // getTableStatus(tableId);
}

let checkGame=(tableId)=>{
  models.Table.find({
    where:{
      id:tableId
    }
  }).then(table=>{
    models.TableUser.findAll({
      where:{
            TableId:tableId,
            status:{$ne:0},
            $and:{status:{$ne:10}}
        },
        order:['position']
    }).then(tableusers=>{
      if(tableusers.length>1){
        models.Game.findAll({
          where:{
            TableId:tableId
          },
          order:[['id','DESC']],
          limit:1,
          raw:true
        }).then((games)=>{
          if(games.length==0){
            let cardList=generateRandom(5+tableusers.length*2);
            models.Card.findAll({}).then(cards=>{
              models.Game.create({
                TableId:tableId,
                currentBet:table.bigBlind,
                order:['id']
              }).then(game=>{
                alist=[];
                for(i=0;i<5;i++){
                  alist.push(models.GameCard.create({
                      GameId:game.id,
                      CardId:cards[cardList[i]].id
                  }));
                }
                let startPos=0;
                for(i=0;i<tableusers.length;i++){
                  var counter=4;
                  dealer=false;
                  smallBlind=false;
                  bigBlind=false;
                  current=false;
                  status=1;
                  if(i==startPos%tableusers.length){dealer=true}
                  if(i==(startPos+1)%tableusers.length){smallBlind=true;}
                  if(i==(startPos+2)%tableusers.length){bigBlind=true;}
                  if(i==(startPos+3)%tableusers.length){current=true;}
                  alist.push(models.GameUser.create({
                      isSmallBlind:smallBlind,
                      isBigBlind:bigBlind,
                      isDealer:dealer,
                      isCurrent:current,
                      GameId:game.id,
                      status:status,
                      TableUserId:tableusers[i]['id']
                    }).then(gameuser=>{
                      if(gameuser.isSmallBlind){
                        alist.push(models.UserPlay.create({
                          playType:2,
                          betAmount:table.smallBlind,
                          GameUserId:gameuser.id
                        }))
                        //reduce user chips
                      }
                      if(gameuser.isBigBlind){
                        alist.push(models.UserPlay.create({
                          playType:2,
                          betAmount:table.bigBlind,
                          GameUserId:gameuser.id
                        }))
                        //reduce user chips
                      }
                      counter++;
                      alist.push(models.UserCard.create({
                        GameUserId:gameuser.id,
                        CardId:cards[cardList[counter]].id
                      }));
                      counter++;
                      alist.push(models.UserCard.create({
                        GameUserId:gameuser.id,
                        CardId:cards[cardList[counter]].id
                      }));
                    }));
                }
                Promise.all(alist).then(data=>{
                  getTableStatus(tableId);
                })
              })
            })
          }
          else{
            // game=games[0];
            // let startPos=0;
            // if(game['status']==0){
            //   models.GameUser.find({
            //     where:{
            //       GameId:game[0].id,
            //       isSmallBlind:true
            //     }
            //   }).then(gameuser=>{
            //     for(i=0;i<tableusers.length;i++){
            //       if(tableusers[i].id=gameuser.TableUserId){
            //         startPos=i;
            //       }
            //     }
            //   })
            //   let cardList=generateRandom(5+tableusers.length);
            //   models.Card.findAll({}).then(cards=>{
            //     models.Game.create({
            //       TableId:tableId
            //     }).then(game=>{
            //       alist=[];
            //       for(i=0;i<5;i++){
            //         alist.push(models.GameCard.create({
            //             GameId:game.id,
            //             CardId:cards[i].id
            //         }));
            //       }
            //       for(i=0;i<tableusers.length;i++){
            //           dealer=false;
            //           smallBlind=false;
            //           bigBlind=false;
            //           current=false;
            //           if(i==startPos%tableusers.length){dealer=true}
            //           if(i==(startPos+1)%tableusers.length){smallBlind=true}
            //           if(i==(startPos+2)%tableusers.length){bigBlind=true}
            //           if(i==(startPos+3)%tableusers.length){current=true}
            //           alist.push(models.GameUser.create({
            //               isSmallBlind:smallBlind,
            //               isBigBlind:bigBlind,
            //               isDealer:dealer,
            //               isCurrent:current,
            //               GameId:game.id,
            //               TableUserId:tableusers[i]['id']
            //             }).then(gameuser=>{
            //               alist.push(models.UserCard.create({
            //                 GameUserId:gameuser.id,
            //                 CardId:cards[5+i*2].id
            //               }));
            //               alist.push(models.UserCard.create({
            //                 GameUserId:gameuser.id,
            //                 CardId:cards[6+i*2].id
            //               }));
            //             }))
            //         }
            //         Promise.all(alist).then(data=>{
            //           getTableStatus(tableId);
            //         })
            //     })
            //   })
            // }
            // else{
            //   getTableStatus(tableId);
            // }
          }
        })
      }
      else{
        getTableStatus(tableId);
      }
    })
  })
}

let getTableStatus=(tableId)=>{
      models.Table.find({
          where:{
            id:tableId
          },
          raw:true
        }
        ).then(table=>{
        models.TableUser.findAll({
          where:{
              TableId:tableId,
              status:{$ne:0},
              $and:{status:{$ne:10}}
          },
          order:['position'],
          include:[
            {
              model:models.User,
              attributes:['id','username','name','avatar']
            }
          ],          
          raw:true
        }).then(tableusers=>{
          tabusers=new Array(9);
          for(i=0;i<tableusers.length;i++){
            tabusers[tableusers[i].position-1]=tableusers[i];
          }
          table.tableusers=tabusers;
          models.Game.find({
            where:{
             status:{$ne:0},
             TableId:table['id']
            },
            include:{
              model:models.GameUser
            }
          }).then(game=>{
            table.game=game;
            //Add previous plays of the users
            //Add game cards
            sendUserInfo(tableId);
            io.to(tableId).emit("table:status",table);
          })
        })
      });
}

let sendUserInfo=(tableId)=>{
  models.Game.find({
    where:{
      TableId:tableId,
      status:{$ne:0}
    }
  }).then(game=>{
    if(game){
      models.GameUser.findAll({
        where:{
          GameId:game.id
        },
        raw:true,
        include:{
          model:models.TableUser
        }
      }).then(gameuser=>{
        gameuser.forEach(function(element) {
          models.UserCard.findAll({
            where:{
              GameUserId:element['id']
            },
            include:{
              model:models.Card
            },
            raw:true
          }).then(usercard=>{
            element['cards']=usercard;
            if(element['isCurrent']){
              models.UserPlay.findAll({
                where:{
                  gameStatus:game.status,
                  GameUserId:element['id']
                },
                order:[['id','DESC']]
              }).then(play=>{
                element['minBet']=game.currentBet-getSum(play);
                io.to(tableId).emit("user:status:"+element['TableUser.UserId'],element);
              })
            }
            else{
              io.to(tableId).emit("user:status:"+element['TableUser.UserId'],element);
            }
          })
        }, this);
      })
    }
  });
}

let getSum=(playList)=>{
  sum=0;
  for(i=0;i<playList.length;i++){
    sum+=playList[i]['betAmount'];
  }
  return sum;
}

let getTableGame=(tableId)=>{
    return models.Game.find({
      where:{
        TableId:tableId,
        status:{$ne:0}
      }
    })
}

io.on("connection", (socket) => {
  let tableId = socket.handshake.query.tableId;
  let token=socket.handshake.query.userToken;
    jwt.verify(token,config.salt,(err,decoded)=>{
			if(err){

			}
			else{
        socket._userId=decoded.id;
        socket._tableId=tableId;
        socket.join(tableId);
				socket.emit("auth",{userId:decoded.id});
        models.TableUser.find({
          where:{
            TableId:socket._tableId,
            UserId:socket._userId,
            status:{
              $ne:2
            }
          }
        }).then(dat=>{
          if(!dat){
            models.TableUser.create({
              TableId:socket._tableId,
              UserId:socket._userId
            }).then(tableuser=>{
              socket._tableUserId=tableuser.id;
            });
          }else{
            socket._tableUserId=dat.id;
          }
          models.User.findById(socket._userId).then(data=>{
            models.TableUser.findAll({
              where:{
                status:{$ne:2}
              },
              include:[
                {
                  model:models.User,
                  attributes:['id','username','name','avatar']
                }
              ]
            }).then(tableusers=>{
              getTableStatus(socket._tableId)
              io.to(socket._tableId).emit("chat:status",{message:data.name+" has joined the lobby.",tableusers:tableusers})
            })
          });
        })
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

    socket.on("raise",data=>{
      getTableGame(socket._tableUserId).then(game=>{
        models.GameUser.find({
          where:{
            GameId:game.id,
            TableUserId:socket._tableUserId
          }
        }).then(user=>{
          //update game's current bet
          user.update({status:4});
          if(user.isCurrent){
            models.UserPlay.create({
              playType:3,
              betAmount:data.bet,
              GameUserId:user.id
            }).then(dat=>{
              getTableStatus(socket._tableId)
            })
          }
        })
      })
    })

    socket.on("stand",data=>{
      getTableGame(socket._tableId).then(game=>{
        models.GameUser.find({
          where:{
            GameId:game.id,
            TableUserId:socket._tableUserId
          }
        }).then(user=>{
            user.update({status:0});
            models.UserPlay.create({
              playType:4,
              GameUserId:user.id
            })
        })
        models.TableUser.findById(socket._tableUserId).then(tableuser=>{
          tableuser.update({status:0}).then(response=>{
            getTableStatus(socket._tableId)
          })
        })
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
          user.update({status:2});
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

    socket.on("call",data=>{
      getTableGame(socket._tableId).then(game=>{  
        models.GameUser.find({
          where:{
            GameId:game.id,
            TableUserId:socket._tableUserId
          }
        }).then(user=>{
          user.update({status:3});
          models.UserPlay.create({
            playType:2,
            betAmount:data.bet,
            GameUserId:user.id,
            gameStatus:game.status
          }).then(dat=>{
            updateGameStatus(socket._tableId);
          })
          //Reduce user chips
        })
      })
    })

    socket.on("fold",data=>{
      getTableGame(socket._tableId).then(game=>{
        models.GameUser.find({
          where:{
            GameId:game.id,
            TableUserId:socket._tableUserId,
            gameStatus:game.status
          }
        }).then(user=>{
          user.update({status:0});
          models.UserPlay.create({
            playType:4,
            GameUserId:user.id
          }).then(dat=>{
            updateGameStatus(socket._tableId)
          })
          })
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