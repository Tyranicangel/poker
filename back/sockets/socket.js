var io = require("socket.io")();
var models = require("../models");
const jwt = require('jsonwebtoken');
const config = require('../config');

// const { Chat } = models;

io.set("origins", "*:*");

let getTableStatus=(tableId)=>{
    models.Table.find({
      where:{
        id:tableId
      },
      include:[
        {
          model:models.Game,
          where:{
            status:1
          },
          include:[
            {
              model:models.GameUser
            }
          ]
        }
      ]
    }).then(table=>{
      return table;
    })
}

let getTableGame=(tableId)=>{
    return models.Game.find({
      where:{
        TableId:tableId
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
                  model:models.User
                  // attributes:['username','name','avatar']
                }
              ]
            }).then(tableusers=>{
              socket.emit("table:status",getTableStatus(socket._tableId));
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
            tableuser.update({status:1,buyIn:data.buyIn,currentChips:data.buyIn,position:data.position}).then(tableuserupdate=>{
              io.to(socket._tableId).emit("table:status",getTableStatus(socket._tableId));
            })
          })
        }
      })
    })

    socket.on("check",data=>{
      getTableGame(socket._tableUserId).then(game=>{
        models.GameUser.find({
          where:{
            GameId:game.id,
            TableUserId:socket._tableUserId
          }
        }).then(user=>{
          if(user.isCurrent){
            models.UserPlay.create({
              playType:1
            }).then(dat=>{
              io.to(socket._tableId).emit("table:status",getTableStatus(socket._tableId));
            })
          }
        })
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
          if(user.isCurrent){
            models.UserPlay.create({
              playType:3,
              betAmount:data.bet
            }).then(dat=>{
              io.to(socket._tableId).emit("table:status",getTableStatus(socket._tableId));
            })
          }
        })
      })
    })

    socket.on("stand",data=>{
      getTableGame(socket._tableUserId).then(game=>{
        models.GameUser.find({
          where:{
            GameId:game.id,
            TableUserId:socket._tableUserId
          }
        }).then(user=>{
            user.update({status:1});
            models.UserPlay.create({
              playType:4
            })
        })
        models.TableUser.findById(socket._tableUserId).then(tableuser=>{
          tableuser.update({status:0}).then(response=>{
            io.to(socket._tableId).emit("table:status",getTableStatus(socket._tableId));
          })
        })
      })
    })

    socket.on("call",data=>{
      getTableGame(socket._tableUserId).then(game=>{
        models.GameUser.find({
          where:{
            GameId:game.id,
            TableUserId:socket._tableUserId
          }
        }).then(user=>{
          if(user.isCurrent){
            models.UserPlay.create({
              playType:2,
              betAmount:data.bet
            }).then(dat=>{
              io.to(socket._tableId).emit("table:status",getTableStatus(socket._tableId));
            })
          }
        })
      })
    })

    socket.on("fold",data=>{
      getTableGame(socket._tableUserId).then(game=>{
        models.GameUser.find({
          where:{
            GameId:game.id,
            TableUserId:socket._tableUserId
          }
        }).then(user=>{
          user.update({status:1});
          if(user.isCurrent){
            models.UserPlay.create({
              playType:4
            }).then(dat=>{
              io.to(socket._tableId).emit("table:status",getTableStatus(socket._tableId));
            })
          }
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

  // models.Table.findById(tableId).then(function(table) {
  //   socket.on("chat:authorize", data => {
  //     const { userId } = data;
  //     socket.__userId = userId;
    
  //     socket.on("chat:message", data => {
  //       const { message, time } = data;
  //       if(message && time){
  //         Chat.create({
  //           message,
  //           createdAt: time,
  //           TableId: table.id
  //         }).then((chatMessage) => {
  //           const values = chatMessage.dataValues;
  //           values.userId = (Math.random() >= 0.5) ? 1:2;
  //           io.to(table.name).emit("chat:message:new", values)
  //         });
  //       }
  //     });

  //     socket.emit("chat:authorize:response", {userId});
  //   });
  // });
});

module.exports = io;