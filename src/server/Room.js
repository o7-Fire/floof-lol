const { Rock, EvilFlower, Diep, MopeMouse, PeaEnemy, Cactus } = require('./Enemy.js');
// this is a singular room. The server has a 2d array of rooms.

const rarityMap = {
    0: 'common',
    1: 'common',
    2: 'unusual',
    3: 'rare',
    4: 'epic',
    5: 'legendary',
    6: 'omnipotent',
    7: 'boss',
    8: 'supreme'
};

const rarityToNumber = {
    common: 1,
    unusual: 2,
    rare: 3,
    epic: 4,
    legendary: 5,
    omnipotent: 6,
    boss: 7,
    supreme: 8
}

const maxWaves = {
    common: 1,
    unusual: 1,
    rare: 2,
    epic: 2,
    legendary: 3,
    omnipotent: 3,
    boss: 1
}

const spawnPower = {
    common: 1,
    unusual: 3,
    rare: 5,
    epic: 10,
    legendary: 19,
    omnipotent: 33,
    boss: 1 // we only want 1 boss
}

// width and height of rooms
const roomDimensions = {
    common: 10,
    unusual: 14,
    rare: 18,
    epic: 24,
    legendary: 32,
    omnipotent: 40,
    boss: 90
};

const Spawner = require('./Spawner.js');
const { Portal } = require('./Enemy.js');
const { Petal } = require('./Petal.js');

module.exports = class Room {
    // x, y is from (0,0) to (5,5). For testing its gonna be from (0,0) to (1,1)
    constructor(x, y){

        // special zones
        //if(x == 3 && y == 0){
        //    this.special = 'rock';
        //} else if(x == 2 && y == 1){
        //    this.special = 'evilflower';
        //} else if(x == 1 && y == 2){
        //    this.special = 'mopemouse';
        //} else if(x == 0 && y == 3){
        //    this.special = 'diep';
        //} else {
        this.special = null;
        //}

        this.rarity = rarityMap[x+y];// look at mspaint diagram
        if(x >= 4 && y >= 4){
            this.rarity = 'boss';
            if(x == 5 && y == 5){
                // boss+ room. We start at + so it's 1
                this.bossLevel = 1;
            }
        }

        this.dimensions = {x: roomDimensions[this.rarity]*47, y: roomDimensions[this.rarity]*47};
        if(x == 5 && y == 5){
          //double the room size
          this.dimensions.x *= 1.5;
          this.dimensions.y *= 1.5;
        }

        this.roomLocation = {x, y};

        this.enemies = [];

        this.wave = 0;
        this.waves = maxWaves[this.rarity];

        this.spawnPower = spawnPower[this.rarity];
        this.spawners = [];// spawners for all 3 waves, only spawner on this.wave is active

        this.generateSpawns();

        this.active = false;
        this.won = false;

        this.petalSlots = [];

        this.generateConnections();
    }
    generateConnections(){
        this.directions = [];

        let {x, y} = this.roomLocation;

        if(rooms[x+1] && x+1 < 4){
            this.directions.push('right')
        }
        if(rooms[x-1]){
            this.directions.push('left');
        }
        if(rooms[x][y-1]){
            this.directions.push('down');
        }
        if(rooms[x][y+1] && y+1 < 4){
            this.directions.push('up');
        }

        if(x == 4 && y == 4){
            this.directions = ['win', 'boss'];
        } else if(x == 5 && y == 5){
            this.directions = [];
        }
    }
    generateSpawns(){
        if(this.rarity == 'boss'){
            this.spawners = [[]];
            if (this.roomLocation.x == 4 && this.roomLocation.y == 4){
              this.bossLevel = 0;
            }
            const bosses = [
                new Rock('boss', this.dimensions, this.bossLevel),
                new EvilFlower('boss', this.dimensions, this.roomLocation, this.bossLevel),
                new Diep('boss', this.dimensions, this.bossLevel),
                new MopeMouse('boss', this.dimensions, this.bossLevel),
                new PeaEnemy("boss", this.dimensions, this.bossLevel),
                new Cactus("boss", this.dimensions, this.bossLevel),
            ]

            const randomBoss = bosses[Math.floor(Math.random()*bosses.length)];

            this.enemies.push(randomBoss);
            broadcastInRoom(this.roomLocation, {newEnemy: randomBoss.initPack()});

            // for(let i = 0; i < bosses.length; i++){
            //     this.enemies.push(bosses[i]);
            //     broadcastInRoom(this.roomLocation, {newEnemy: bosses[i].initPack()});
            // }

            return;
        }
        for(let i = 0; i < this.waves; i++){
            this.spawners[i] = [];
            let spawnerAmount = this.waves+1;
            let powerForEachSpawner = this.spawnPower/spawnerAmount;
            for(let j = 0; j < spawnerAmount; j++){
                const thisSpawnPower = powerForEachSpawner*(Math.random()*0.6+0.7);// 0.7 to 1.3 times spawnPower, at random

                let thisSpawnRarity = rarityToNumber[this.rarity];

                // 75% chance to decrease 1 rarity, 25 after that to decrease another rarity
                if (i == 2 && this.rarity == "omnipotent"){
                    // only omnis last wave (altered bc too hard)
                    if(Math.random() < 0.5){
                        thisSpawnRarity--;
                    }
                }
                else {
                    if(Math.random() < 0.75){
                        thisSpawnRarity--;
                        if(Math.random() < 0.25){
                            thisSpawnRarity--;
                        }
                    }
                }

                thisSpawnRarity = Math.max(1, thisSpawnRarity);

                thisSpawnRarity = rarityMap[thisSpawnRarity];

                //points, rarity, dimensions, forceEnemyType=null
                // TODO: special waves
                this.spawners[i][j] = new Spawner(thisSpawnPower, thisSpawnRarity, this.dimensions, this.roomLocation, this.special);
            }
        }
    }
    initPack(){
        return {
            enemies: this.enemies.map(e => e.initPack()),
            players: getPlayersInRoom(this.roomLocation),
            dimensions: this.dimensions,
            rarity: this.rarity
            //petalSlots: this.petalSlots,
        }
    }
    updatePack(){
        const currentPlayers = {};

        const players = getPlayersInRoom(this.roomLocation);
        for(let id in players){
            currentPlayers[id] = players[id].updatePack();
        }

        return {
            enemies: this.enemies.map(e => e.updatePack()),
            players: currentPlayers,
        }
    }
    simulate(dt){
        const players = getPlayersInRoom(this.roomLocation);

        for(let id in players){
            players[id].simulate(dt, this.enemies);
            if(this.roomLocation.x >= 4){
                // healing in the boss room
                players[id].hp += dt/200;
                if(players[id].hp > players[id].maxHp){
                    players[id].hp = players[id].maxHp;
                }
            }
        }

        for(let i = 0; i < this.enemies.length; i++){
            if(this.enemies[i].dead === true)continue;
            this.enemies[i].simulate(dt, players, this.enemies, this.roomLocation);
        }

        this.runCollision(players);

        // simulateSpawners
        if(this.won === true){
            return;
        }

        for(let i = 0; i < this.spawners[this.wave].length; i++){
            let spawn = this.spawners[this.wave][i].simulate(dt);
            if(spawn !== undefined){
                // making sure that you dont spawn on top of any players
                // this can be abused by having players at like every point in the map but idc
                let validSpawn = true;
                for(let id in players){
                    if(Math.sqrt((players[id].x - spawn.x)**2+(players[id].y - spawn.y)**2) < spawn.r + players[id].r + 40){
                        validSpawn = false;
                        break;
                    }
                }
                if(validSpawn){
                    this.enemies.push(spawn);
                    broadcastInRoom(this.roomLocation, {newEnemy: spawn.initPack()});
                }
            }
        }

        this.spawners[this.wave] = this.spawners[this.wave].filter(spawner => spawner.finished === false);

        if(this.spawners[this.wave].length === 0 && this.getAliveEnemies().length === 0){
            if(this.roomLocation.x == 5 && this.roomLocation.y == 5){
                    if(this.spawnBossTimer == undefined){this.spawnBossTimer = 5000;}
                    this.spawnBossTimer -= dt;
                    if(this.spawnBossTimer < 0){
                        // endless mode. We dont push the portal. instead we just decrement the wave counter
                        this.won = false;
                        this.wave = 0;
                        this.generateSpawns();
                        this.bossLevel++;
                        this.spawnBossTimer = undefined;
                    }
                }
            else{
            this.wave++;
            if(this.spawners[this.wave] === undefined){
                // you've won! congrats!
                this.won = true;

                // pushing portals
                for(let i = 0; i < this.directions.length; i++){
                    const exitPortal = new Portal(this.rarity, this.dimensions, this.directions[i]);
                    this.enemies.push(exitPortal);
                    broadcastInRoom(this.roomLocation, {newEnemy: exitPortal.initPack()});
                }

                // boss portal
                if(this.roomLocation.x == 3 && this.roomLocation.y == 3){
                    const exitPortal = new Portal(this.rarity, this.dimensions, 'boss');
                    this.enemies.push(exitPortal);
                    broadcastInRoom(this.roomLocation, {newEnemy: exitPortal.initPack()});
                }
            }
            }
        }
    }
    runCollision(players){
        // enemy-enemy
        for(let i = 0; i < this.enemies.length; i++){
            if(this.enemies[i].dead === true || this.enemies[i].type === 'portal')continue;
            for(let j = 0; j < this.enemies.length; j++){
                if(i === j || this.enemies[j].dead === true || this.enemies[j].type === 'portal')continue;
                this.boundObstacles(this.enemies[i], this.enemies[j]);
            }
        }

        // enemy-player
        for(let id in players){
            for(let i = 0; i < this.enemies.length; i++){
                if(this.enemies[i].dead === true)continue;

                if(this.enemies[i].type !== 'portal'){
                    for(let j = 0; j < players[id].petals.length; j++){
                        if(players[id].petals[j].hp < 0)continue;
                        this.collidePetal(players[id].petals[j], this.enemies[i], true);
                    }
                }

                this.boundObstacles(players[id], this.enemies[i], true);
            }

            this.boundWalls(players[id]);

            if(players[id].hp < 0){
                broadcastInRoom(this.roomLocation, {removePlayer: id});
                send({removeSelf: true}, id); // idk if this is right
                delete players[id];
            }
        }

        // enemy-wall
        for(let i = 0; i < this.enemies.length; i++){
            if(this.enemies[i].dead === true)continue;
            if(this.enemies[i].hp < 0){
                // broadcastInRoom(this.roomLocation, {removeEnemy: i});
                this.enemies[i].dead = true;

                // kill all other enemies if the enemy happens to be a boss
                if(this.enemies[i].rarity === 'boss' && this.enemies[i].type !== 'bullet'){
                    for(let j = 0; j < this.enemies.length; j++){
                        this.enemies[j].dead = true;
                    }
                }

                // if(this.enemies[i].rarity === 'boss'){
                //     continue;
                // }

                const drops = this.enemies[i].drop(this.dimensions);
                this.petalSlots = [...this.petalSlots, ...drops];

                for(let id in players){
                    players[id].collectablePetals = [...players[id].collectablePetals, ...drops];
                }
                broadcastInRoom(this.roomLocation, {drops: drops.map(drop => drop.initPack())});
            } else {
                this.boundWalls(this.enemies[i]);
            }
        }

        // petalSlot-player
        for(let id in players){
            this.collectPetalSlots(players[id]);
        }
    }
    boundWalls(p){
        if(p.x + p.r > this.dimensions.x){
            p.x = this.dimensions.x - p.r;
        } else if(p.x - p.r < 0){
            p.x = p.r;
        }
        if(p.y + p.r > this.dimensions.y){
            p.y = this.dimensions.y - p.r;
        } else if(p.y - p.r < 0){
            p.y = p.r;
        }
    }
    boundObstacles(p1, p2, takeDamage){
        const distance = { x: p1.x - p2.x, y: p1.y - p2.y };
        if (distance.x === 0 && distance.y === 0) return;
        const magnitude = Math.sqrt(distance.x ** 2 + distance.y ** 2);
        if (magnitude < p2.r + p1.r + 2) {
            if(p1.isPlayer === true && p2.type === 'portal'){
                if(p2.side === 'win'){
                    send({win: true}, p1.id);
                } else {
                    global.exitingPlayers[p1.id] = p2.side;
                }
                return;
            }

            const angle = Math.atan2(distance.y, distance.x);

            // the amount we actually have to push out
            const difference = p2.r + p1.r - magnitude;
            // we divide by 2 for each block for equal weighting

            p2.x -= Math.cos(angle) * difference / 2;
            p2.y -= Math.sin(angle) * difference / 2;
            p1.x += Math.cos(angle) * difference / 2;
            p1.y += Math.sin(angle) * difference / 2;

            if(takeDamage === true){
                p1.hp -= p2.damage;
                if(p2.type === 'mopemouse'){
                    p1.impulse.x += Math.cos(angle) * 980;
                    p1.impulse.y += Math.sin(angle) * 980;
                } else {
                    p1.impulse.x += Math.cos(angle) * 840;
                    p1.impulse.y += Math.sin(angle) * 840;
                }

                p2.hp -= p1.damage;
                p2.impulse.x -= Math.cos(angle) * 840;
                p2.impulse.y -= Math.sin(angle) * 840;
            }
        }

        if(p1.isPlayer === true && p2.type === 'evilflower'){
            // petal-player collision
            for(let i = 0; i < p2.petals.length; i++){
                this.collidePetal(p2.petals[i], p1);
                for(let j = 0; j < p1.petals.length; j++){
                    this.collidePetalPetal(p1.petals[j], p2.petals[i]);
                }
            }
        }
    }
    collidePetal(petal, enemy){
        if(petal.type === 'dieppetal'){
            for(let i in petal.bullets){
                this.collidePetal(petal.bullets[i], enemy);
            }
        }
        if(petal.hp < 0)return;
        const distance = { x: petal.x - enemy.x, y: petal.y - enemy.y };
        if (distance.x === 0 && distance.y === 0) return;
        const magnitude = Math.sqrt(distance.x ** 2 + distance.y ** 2);
        if (magnitude < enemy.r + petal.r + 2/*to account for delays and such*/) {
            if(petal.isBossPetal === true && enemy.isPlayer === true){
                // player - evilflower petal collision
                enemy.hp -= petal.damage;
                petal.hp -= enemy.damage;
                // bounding
                const angle = Math.atan2(distance.y, distance.x);
                enemy.x = petal.x - Math.cos(angle) * (enemy.r + petal.r + 2);
                enemy.y = petal.y - Math.sin(angle) * (enemy.r + petal.r + 2);
            } else {
                // one must die >:)
                do {
                    enemy.hp -= petal.damage;
                    petal.hp -= enemy.damage;
                } while(enemy.hp > 0 && petal.hp > 0);
            }
        }
    }
    collidePetalPetal(petal, petal2){
        if(petal.type === 'dieppetal'){
            for(let i in petal.bullets){
                this.collidePetal(petal.bullets[i], petal2);
            }
        }
        if(petal2.type === 'dieppetal'){
            for(let i in petal2.bullets){
                this.collidePetal(petal2.bullets[i], petal);
            }
        }
        if(petal.hp < 0 || petal2.hp < 0)return;
        const distance = { x: petal.x - petal2.x, y: petal.y - petal2.y };
        if (distance.x === 0 && distance.y === 0) return;
        const magnitude = Math.sqrt(distance.x ** 2 + distance.y ** 2);
        if (magnitude < petal2.r + petal.r + 2/*to account for delays and such*/) {
            // one must die >:)
            do {
                petal2.hp -= petal.damage;
                petal.hp -= petal2.damage;
            } while(petal2.hp > 0 && petal.hp > 0);
        }
    }
    collectPetalSlots(player){
        // TODO: send the petal slot id to delete it and make sure player cant collect duplicate petal slots with id
        for(let i = 0; i < player.collectablePetals.length; i++){
            const petalSlot = player.collectablePetals[i];

            if(Math.sqrt((player.x - petalSlot.x)**2+(player.y - petalSlot.y)**2) < player.r + petalSlot.r/Math.sqrt(2)){
                // determine the weakest petal
                let leastRarity = 600;
                for(let i = 0; i < player.petals.length; i++){
                    if(rarityToNumber[player.petals[i].rarity] < leastRarity){
                        leastRarity = rarityToNumber[player.petals[i].rarity];
                    }
                }

                if(leastRarity >/* = */ rarityToNumber[petalSlot.rarity]){
                    break;
                }

                // array of indexes of worst petals
                let worstPetals = [];
                for(let i = 0; i < player.petals.length; i++){
                    if(rarityToNumber[player.petals[i].rarity] === leastRarity){
                        worstPetals.push(i);
                    }
                }

                // if the new petal has the same rarity as the worst ones,
                // then we don't want a petal to replace an exact copy of itself
                if(leastRarity === rarityToNumber[petalSlot.rarity]){
                    worstPetals = worstPetals.filter(pId => player.petals[pId].type !== petalSlot.petalType);
                    if(worstPetals.length === 0){
                        // we already have 5 petal slots of the same type
                        break;
                    }
                }

                // choose a random petal out of worst petal index
                const worstPetalIndex = worstPetals[Math.floor(Math.random()*worstPetals.length)];
                const worstPetal = player.petals[worstPetalIndex];

                player.petals[worstPetalIndex] = new Petal(petalSlot.petalType, petalSlot.rarity, worstPetal.angle, player);
                // console.log(player.petals)
                broadcastInRoom(this.roomLocation, {playerId: player.id, petalId: worstPetalIndex, newPetal: player.petals[worstPetalIndex].initPack()});

                send({collectPetal: player.collectablePetals[i].id}, player.id);

                player.collectablePetals[i] = 'dead';
            }
        }

        player.collectablePetals = player.collectablePetals.filter(p => p !== 'dead');
    }
    getAliveEnemies() {
        return this.enemies.filter(e => e.dead === false && e.type !== 'bullet');
    }
}

// function objectMap(object, mapFn) {
//     return Object.keys(object).reduce(function(result, key) {
//         result[key] = mapFn(object[key])
//         return result
//     }, {})
// }