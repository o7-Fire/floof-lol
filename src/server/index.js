const express = require('express');
const WebSocket = require('ws');
const uuid = require("uuid");
const path = require("path");
const app = express();
const http = require("http");
const wss = new WebSocket.Server({ noServer: true });
const msgpack = require("msgpack-lite");

const Room = require('./Room.js');
const Player = require('./Player.js');

const clients = {};

global.playersInRoom = {
    /*room.x: {
        room.y: {
            player.id: Player{},
            player2.id: Player2{}
        }
    }*/
};

const players = {
    /*player.id: Player{}*/
}

global.exitingPlayers = {
    /*players that should transition rooms*/
    /*player.id: direction*/
}

global.rooms = {};
for(let i = 0; i < 4; i++){
    rooms[i] = {};
    playersInRoom[i] = {};
    for(let j = 0; j < 4; j++){
        rooms[i][j] = new Room(i, j);
        playersInRoom[i][j] = {};
    }
}

for(let i = 0; i < 4; i++){
    for(let j = 0; j < 4; j++){
        rooms[i][j].generateConnections();
    }
}

var iid = 0;

app.use(express.static("src/client"));

app.get("/", function (req, res) {
    console.log("a");
  res.sendFile("index.html");
});
// message handling
let processMsg = {
    //name: (name, player) => {
    //    player.playerName = name.name;
        //console.log(player);
    //},
    chat: (msg, player) => {
        msg.chat = msg.chat.trim();
        if(msg.chat.length > 100)return; // fix line 80
        if(msg.chat === "") return;
        if(msg.chat === '/logplayers'){
            forEachRoom((x, y) => {
                const room = rooms[x][y];
                if(room.active === true){
                    const roomIndex = x + ' ' + y;
                    console.log({roomIndex: room.players});
                }
            })
            return;
        }
        broadcastInRoom(player.room, {chat: "Player " + player.playerId + ": " + msg.chat.slice(0,100)});//very trusted source
    },
    connected: (msg) => {
        // window.connected = true;
        // ??
    },
    angle: (msg, player) => {
        player.angle = msg.angle;
        player.magnitude = Math.min(300, msg.magnitude);
        player.lastInputTimer = Date.now();
    },
    magnitude: () => {},
    attack: (msg, player) => { player.attack(msg) },
    defend: (msg, player) => { player.defend(msg) },
}

const defaultState = {
    x: 23.5,
    y: 23.5,
    room: {x: 0, y: 0},
    angle: 0,
    magnitude: 0,
    attacking: false,
    defending: false
}

wss.on("connection", ws=>{
    // player opens new tab
    ws.binaryType = "arraybuffer"

    iid++;
    if(iid > 9999){
        iid = 0;
    }
    const clientId = iid;
    clients[iid] = ws;

    addToRoom(definePlayer(iid, defaultState));

	ws.on("message",(data)=>{
		const msg = msgpack.decode(new Uint8Array(data));

        for(let key in msg){
            if(processMsg[key]){
                processMsg[key](msg, players[clientId]);// hash table faster :DDDD
            } else {
                console.warn(`Server sided response for ${key} isnt defined! go to index.js and define it rn.`);
            }
        }
	})
	ws.on('close',() => {
        removeFromRoom(players[clientId]);
		//player leaves
        delete clients[clientId];
        delete players[clientId];
	})
})

const port = process.env.PORT || 3001; 
const srvr = app.listen(port, () =>{
    console.log(`Server started on port ${port}`);
});

srvr.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  });
});

global.send = function(msg,id){
    clients[id].send(msgpack.encode(msg));
} 

global.broadcastInRoom = function({x, y}, msg){
    for(let id in getPlayersInRoom({x, y})){
        send(msg,id);
    }
}

// simulating the game

global.delta = 0;
let lastTime = Date.now();

setInterval(() => {
    global.delta = Date.now() - lastTime;
    lastTime = Date.now();

    simulate(global.delta);

    sendState();
    const lag = Date.now() - lastTime;
    if(lag > 1000/15){
        console.log(`Server is lagging behind by ${lag}ms`);
    }
}, 1000/15)// we purposely simulate very jittery so that we NEVER lag :D client will fill in the info 

function simulate(dt) {
    forEachRoom((x, y) => {
        const room = rooms[x][y];
        if(room.active === true){
            room.simulate(dt);
        }
    })

    for(let id in exitingPlayers){
        moveToRoom(players[id], exitingPlayers[id]/*<- the direction that the exitingplayer is going*/);
    }
    exitingPlayers = [];
}

function forEachRoom(fn){
    for(let x in rooms){
        for(let y in rooms){
            // if we're in the danger zones (outside of the 0-3 by 0-3 4x4 cube, then only continue if we're not in 4,4 or 5,5)
            if((x > 3 || y > 3) && x != y)continue;
            fn(x, y);
        }
    }
}

function sendState(){
    for(let x in rooms){
        for(let y in rooms){
            if((x > 3 || y > 3) && x != y)continue;
            broadcastInRoom({x, y}, {state: rooms[x][y].updatePack()});
        }
    }
}

function addToRoom(player, direction="top"){
    const room = rooms[player.room.x][player.room.y];

    // temp
    // if(Object.keys(getPlayersInRoom(player.room)).length === 0){
        room.active = true;
    // }

    if(room.roomLocation.x == 4 && room.roomLocation.y == 4){
        // 10 tries to not be within the boss
        const boss = room.enemies.filter(e => e.rarity === 'boss')[0];
        for(let i = 0; i < 10; i++){
            player.x = room.dimensions.x*Math.random();
            player.y = room.dimensions.y*Math.random();
            if(Math.sqrt((player.x - boss.x)**2+(player.y - boss.y)) > boss.r*1.5 + player.r){
                // we're outside of the boss's range. Therefore, this is a valid spawn
                break;
            }
        }

    } else {
        player.x = room.dimensions.x/2;
        player.y = room.dimensions.y/2;
    }


    for(let i = 0; i < player.petals.length; i++){
        player.petals[i].x = player.x;
        player.petals[i].y = player.y;
    }

    send({connected: true, selfId: player.id, initialState: room.initPack()}, player.id);
    broadcastInRoom(player.room, {newPlayer: player.initPack()});
    //broadcast minimap
    broadcastInRoom(player.room, {minimap: global.getRoomsMinimap()});
}

function removeFromRoom(player){
    const roomLocation = {x: player.room.x, y: player.room.y};
    const room = rooms[roomLocation.x][roomLocation.y];
    broadcastInRoom(roomLocation, {removePlayer: player.id});

    delete playersInRoom[roomLocation.x][roomLocation.y][player.id];

    if(Object.keys(getPlayersInRoom(roomLocation)).length === 0){
        rooms[roomLocation.x][roomLocation.y] = new Room(roomLocation.x, roomLocation.y);
        rooms[roomLocation.x][roomLocation.y].generateConnections();

        playersInRoom[roomLocation.x][roomLocation.y] = {};
    }
}

function moveToRoom(player, direction){

    // determine direction of new room
    const newRoom = {x: player.room.x, y: player.room.y};
    if(direction === 'right'){
        newRoom.x++;
    } else if(direction === 'left'){
        newRoom.x--;
    } else if(direction === 'up'){
        newRoom.y++;
    } else if(direction === 'down'){
        newRoom.y--;
    } else if(direction === 'boss'){
        newRoom.x++;
        newRoom.y++;
    }

    const newPlayer = definePlayer(player.id, {...player, room: newRoom});// we form a new player based on the old player's state + new room number

    removeFromRoom(player);// remove the shell from the old room
    addToRoom(newPlayer, direction);// add the newly created player to the new room
}

function definePlayer(id, init){
    // indexing player in both arrays
    const player = new Player(id, init);
    players[id] = player;
    playersInRoom[player.room.x][player.room.y][id] = player;
    return player;
}

global.getPlayersInRoom = function({x, y}){
    return playersInRoom[x][y];
}

global.getRoomsMinimap = function(){
    const minimap = [];//array of {x, y}
    for(let x in rooms){
        for(let y in rooms){
            if((x > 3 || y > 3) && x != y)continue;
            minimap.push({x, y,
                active: rooms[x][y].active,
                connections: rooms[x][y].connections,
            });
        }
    }
    return minimap;
}

// boss room
playersInRoom[4] = {};
playersInRoom[4][4] = {};

global.rooms[4] = {};
global.rooms[4][4] = new Room(4, 4);
// global.rooms[4][4].directions = ['win'];

// boss+ and further room
playersInRoom[5] = {};
playersInRoom[5][5] = {};

global.rooms[5] = {};
global.rooms[5][5] = new Room(5, 5);

setInterval(() => {
    forEachRoom((x, y) => {
        const now = Date.now();
        const room = rooms[x][y];
        if(room.active === true){
            for(let p in room.players){
                if(now - room.players[p].lastInputTimer > 100000){// 100 secs
                    console.log('closing');
                    clients[p].close();
                }
            }
        }
    })
}, 5000)