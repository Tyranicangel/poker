var io = require('socket.io')();
var models = require('../models');

io.set("origins","*:*");

io.on('connection',function(socket){
    let tableId=socket.handshake.query.tableId;
    models.Table.findById(tableId).then(function(table){
        socket.join(table.name);
        io.to(table.name).emit("outgoing",table.name);
    });
});

io.on('incoming',function(data){
    console.log(data);
})

module.exports=io;