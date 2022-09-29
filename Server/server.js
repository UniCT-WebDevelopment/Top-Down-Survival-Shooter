const express=require("express");
const app=express();
const server=require("http").Server(app);
const { Server } = require("socket.io");
const io = new Server(server);
var roomN=1;
var players={};
app.use("/assets",express.static("../assets/"));
app.get("/",function(req,res){
    res.sendFile("/Users/andre/OneDrive - Università degli Studi di Catania/3° anno/Web Programming, Design & Usability/Html codes/Progetto Web/index.html");
});
io.on('connection', function (socket) {
    console.log('a user connected '+socket.id);
    players[socket.id]={
        playerId: socket.id,
        room:roomN
    } 
    socket.join("room-"+players[socket.id].room);
    io.sockets.in("room-"+players[socket.id].room).emit("getNumOfPlayers",io.sockets.adapter.rooms.get("room-"+players[socket.id].room).size);
    if(io.sockets.adapter.rooms.get("room-"+players[socket.id].room).size==4) {
        var clients= io.sockets.adapter.rooms.get('room-'+players[socket.id].room);
        var clientids=[];
        for(var clientId of clients){
            clientids.push(io.sockets.sockets.get(clientId).id);
        }
        io.sockets.in("room-"+players[socket.id].room).emit("fullRoom",clientids);
        io.sockets.in("room-"+players[socket.id].room).emit("getPlayers",players[socket.id]);
        roomN++;
    }
    socket.on("playeridle",()=>{
        socket.broadcast.to("room-"+players[socket.id].room).emit("playerNotMoving",socket.id);
    });
    socket.on("playermove",(newPosition)=>{
        socket.broadcast.to("room-"+players[socket.id].room).emit("updatePos",newPosition,socket.id);
    });
    socket.on("newAngle",(newAngle)=>{
        socket.broadcast.to("room-"+players[socket.id].room).emit("updateAngle",newAngle,socket.id);
    });
    socket.on("playerReload",()=>{
        socket.broadcast.to("room-"+players[socket.id].room).emit("playerIsReloading",socket.id);
    });
    socket.on("weaponChange",(newWeapon)=>{
        socket.broadcast.to("room-"+players[socket.id].room).emit("updateWeapon",newWeapon,socket.id);
    });
    socket.on("playerMining",(stopped)=>{
        if(!stopped)socket.broadcast.to("room-"+players[socket.id].room).emit("playerIsMining",socket.id);
        else socket.broadcast.to("room-"+players[socket.id].room).emit("playerStoppedMining",socket.id);
    });
    socket.on("PlayerShooting",(target)=>{
        socket.broadcast.to("room-"+players[socket.id].room).emit("updatePlayerShooting",socket.id,target);
    });
    socket.on("PlayerHit",(idOfPlayerHit,damage)=>{
        io.to(idOfPlayerHit).emit("DamageTaken",damage);
    });
    socket.on("PlayerDead",()=>{        
        socket.broadcast.to("room-"+players[socket.id].room).emit("eliminatePlayer",socket.id);
        socket.broadcast.to("room-"+players[socket.id].room).emit("updateTargets",socket.id);
        io.to("room-"+players[socket.id].room).emit("eliminateTurrets",socket.id);
    });
    socket.on("TurretBuilt",(turretBaseUsed)=>{
        socket.broadcast.to("room-"+players[socket.id].room).emit("updateTurrets",turretBaseUsed);
    });
    socket.on("TurretAngle",(turretBaseUsed,angleOfTurret)=>{
        socket.broadcast.to("room-"+players[socket.id].room).emit("updateTurretAngle",turretBaseUsed,angleOfTurret);
    });    
    socket.on("TurretShooting",(turretBaseUsed,angleOfTurret,target)=>{
        socket.broadcast.to("room-"+players[socket.id].room).emit("updateTurretShooting",turretBaseUsed,angleOfTurret,target);
    });    
    socket.on("TurretStoppedShooting",(turretBaseUsed,angleOfTurret)=>{
        socket.broadcast.to("room-"+players[socket.id].room).emit("updateTurretStoppedShooting",turretBaseUsed,angleOfTurret);
    });
    socket.on('disconnect', function () {
      console.log('user disconnected');
      let room=players[socket.id].room;
      if(io.sockets.adapter.rooms.get('room-'+room)){
        io.sockets.in("room-"+room).emit("getNumOfPlayers",io.sockets.adapter.rooms.get("room-"+room).size);
        socket.broadcast.to("room-"+room).emit("eliminatePlayer",socket.id);
        socket.broadcast.to("room-"+room).emit("updateTargets",socket.id);
      }
      socket.leave("room-"+room);
      delete players[socket.id];
    });
});
server.listen(8080);
