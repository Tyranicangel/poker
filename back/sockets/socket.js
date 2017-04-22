var io = require("socket.io")();
var models = require("../models");

const { Chat } = models;

io.set("origins", "*:*");

io.on("connection", function(socket) {
  let tableId = socket.handshake.query.tableId;

  models.Table.findById(tableId).then(function(table) {
    socket.on("chat:authorize", data => {
      const { userId } = data;
      socket.__userId = userId;
    
      socket.on("chat:message", data => {
        const { message, time } = data;
        if(message && time){
          Chat.create({
            message,
            createdAt: time,
            TableId: table.id
          }).then((chatMessage) => {
            const values = chatMessage.dataValues;
            values.userId = (Math.random() >= 0.5) ? 1:2;
            io.to(table.name).emit("chat:message:new", values)
          });
        }
      });

      socket.emit("chat:authorize:response", {userId});
    });

    socket.join(table.name);
    io.to(table.name).emit("outgoing", table.name);
  });
});

io.on("incoming", function(data) {
  console.log(data);
});

module.exports = io;
