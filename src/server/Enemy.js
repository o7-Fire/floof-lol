const {
    BasicPetalSlot,
    RockPetalSlot,
    DiepPetalSlot,
    BubblePetalSlot,
    PeaPetalSlot,
    CactusPetalSlot
} = require('./PetalSlot.js');
const {
    BasicPetal,
    RockPetal,
    DiepPetal,
    BubblePetal,
    PeaPetal,
    CactusPetal
} = require('./Petal.js');

const playerSpeed = 1;
const petalDistance = 61.1;

// class Mouse {
//     constructor(rarity, {x, y, w, h}){
//         this.r =
//     }
// }

const rarityToScalar = {
    common: 1,
    unusual: 2,
    rare: 3,
    epic: 4,
    legendary: 5,
    omnipotent: 6,
    boss: 7,
    supreme: 8,
    bossattack3: 12
};

const scalarToRarity = {
    1: 'common',
    2: 'unusual',
    3: 'rare',
    4: 'epic',
    5: 'legendary',
    6: 'omnipotent',
    7: 'boss',
    8: 'supreme'
};

// const enemyStats = {
//     rock: {
//         common: {hp: 20, damage: 2},
//         unusual: {hp: 40, damage: 4},
//         rare: {hp: 120, damage: 8},
//         epic: {hp: 480, damage: 16},
//         legendary: {hp: 2400, damage: 32},
//         omnipotent: {hp: 2400*6, damage: 100},
//     },
//     evilflower: {
//         common: {hp: 30, damage: 10},
//         unusual: {hp: 50, damage: 10},
//         rare: {hp: 150, damage: 10},
//         epic: {hp: 600, damage: 10},
//         legendary: {hp: 1200, damage: 10},
//         omnipotent: {hp: 2000, damage: 10},
//     },
//     diep: {
//         common: {hp: 60, damage: 10},
//         unusual: {hp: 140, damage: 20},
//         rare: {hp: 330, damage: 30},
//         epic: {hp: 966, damage: 40},
//         legendary: {hp: 2800, damage: 60},
//         omnipotent: {hp: 6200, damage: 60},
//     }
// }

// we can figure out this later

class Rock {
    constructor(rarity, dimensions, bossLevel) {
      this.bossLevel = bossLevel ?? 0;
        const scalar = rarityToScalar[rarity];
        this.r = (6 * (scalar ** 2.25) - 4) * (0.8 + Math.random() * 0.4) * 1.25;
        if (rarity === 'common') {
            this.r = 7 + Math.random() * 6;
        }
        // if(rarity === 'omnipotent'){
        //     this.r *= 3;
        // }
        this.rarity = rarity;
        this.x = Math.random() * (dimensions.x - this.r * 2) + this.r;
        this.y = Math.random() * (dimensions.y - this.r * 2) + this.r;
        this.type = 'rock';

        // this.hp = (this.r+10)**(1.85)/12+8;
        // this.damage = 4*scalar**2.15/1.2;// omni = 1shot anyone, common = 1/25 of your hp

        // haha's ver
        // this.hp = 10 + 10 * (3 ** scalar) //enemyStats[this.type][this.rarity].hp;
        // this.damage = 3 * (1.15 ** scalar) //enemyStats[this.type][this.rarity].damage;

        this.hp = 10+10*(1.85**scalar)//enemyStats[this.type][this.rarity].hp;
        this.damage = 3*(1.1**scalar)//enemyStats[this.type][this.rarity].damage;

        this.impulse = {
            x: 0,
            y: 0
        };

        this.dead = false;

        this.dimensions = dimensions;

        if (rarity === 'boss') {
            this.bossLevel = bossLevel;
            this.r *= 1.8;
            this.hp *= 9;

            this.cooldown = 2000;
            this.destination = {
                x: 0,
                y: 0
            };

            this.jumpTime = 0;
            this.jumping = false;

            this.initial = {x: 0, y: 0};
            this.initialRadius = this.r;

            this.attackNumber = Math.floor(Math.random()*2);

            this.hp *= 2/*.5*/**bossLevel;
            this.maxHp = this.hp;
            let radiusIncrease = 1.1**bossLevel;
            if (radiusIncrease > 2){
              radiusIncrease = 2;
            }
            this.r *= radiusIncrease;
            this.cooldown *= 0.8**bossLevel;
        }

        this.maxHp = this.hp;
    }
    simulate(dt, players, enemies, roomLocation) {
        if (this.rarity !== 'boss') return;
        this.cooldown -= dt+this.bossLevel/2;
        if (this.cooldown < 0) {
            if(this.attackNumber === 0){
                if(this.jumping === false){
                    const angle = Math.random()*Math.PI*2;
                    this.destination = {
                        x: this.x + Math.cos(angle)*2000,//Math.random() * (this.dimensions.x - this.r * 2) + this.r,
                        y: this.y + Math.sin(angle)*2000//Math.random() * (this.dimensions.x - this.r * 2) + this.r
                    };
                    this.initial = {x: this.x, y: this.y};
                    this.jumping = true;
                }

                this.jumpTime += 0.02+this.bossLevel/100;
                // jump around
                if(this.jumpTime < 0.2){
                    // shrink radius
                    const t = this.jumpTime*5;
                    this.r = (1-t)*this.initialRadius + t*(this.initialRadius/1.5);
                } else if(this.jumpTime < 0.8){
                    // move to this.destination
                    const t = ((this.jumpTime - 0.2) / 0.8);// **2 to give scaling movement
                    this.x = (1-t)*this.initial.x + t*this.destination.x;
                    this.y = (1-t)*this.initial.y + t*this.destination.y;
                } else if (this.jumpTime < 1) {
                    // grow radius
                    const t = (this.jumpTime-0.8)*5;
                    this.r = t*this.initialRadius + (1-t)*(this.initialRadius/1.5);
                } else if(this.jumpTime >= 1){
                    this.jumpTime = 0;
                    this.cooldown = 2000;
                    this.jumping = false;
                    this.attackNumber = Math.floor(Math.random()*2.25);
                }
            } else if(this.attackNumber === 1) {
                // rock grows bigger and then goes smaller again
                this.jumpTime += 0.02+this.bossLevel/100;
                if(this.jumpTime < 0.4){
                    const t = this.jumpTime*2.5;
                    this.r = t*this.initialRadius*1.3 + (1-t)*(this.initialRadius);
                } else if(this.jumpTime >= 1){
                    this.jumpTime = 0;
                    this.cooldown = 2000;
                    this.jumping = false;
                    this.attackNumber = Math.floor(Math.random()*2.25);
                } else if(this.jumpTime > 0.6){
                    const t = (this.jumpTime-0.6)*2.5;
                    this.r = t*this.initialRadius + (1-t)*(this.initialRadius*1.3);
                }
            } else if(this.attackNumber === 2) {
                // only to be used on boss+ or above
                if(this.bossLevel == 0){
                    this.jumpTime = 0;
                    this.cooldown = 0;
                    this.jumping = false;
                    this.attackNumber = Math.floor(Math.random()*2);
                }
                this.jumpTime += (0.2 + this.bossLevel / 100) * 3/2;
                const spawnAngle = this.jumpTime * Math.PI * 2;// 2 pi

                let rand = Math.random();
                let spawns = [];
                if(Math.random() < 0.5){
                    // spawn diep that shoots rock bullets and is rendered with rock color tank base
                    if(rand < 0.3){
                        spawns = [new Diep('epic', this.dimensions, 0, true)];
                    } else if(rand < 0.6) {
                        spawns = [new Diep('legendary', this.dimensions, 0, true)];
                    } else if(rand < 0.9){
                        spawns = [new Diep('omnipotent', this.dimensions, 0, true)];
                    } else {
                        for(let i = 0; i < 10; i++){
                            // spawn 10
                            spawns.push(new Diep('rare', this.dimensions, 0, true));
                        }
                    }
                } else {
                    if(rand < 0.3){
                        for(let i = 0; i < 2; i++){
                            spawns.push(new EvilFlower('epic', this.dimensions, roomLocation));
                        }
                    } else if(rand < 0.6) {
                        spawns = [new EvilFlower('legendary', this.dimensions, roomLocation)];
                    } else if(rand < 0.9){
                        spawns = [new EvilFlower('omnipotent', this.dimensions, roomLocation)];
                    } else {
                        for(let i = 0; i < 10; i++){
                            // spawn 10
                            spawns.push(new EvilFlower('rare', this.dimensions, roomLocation));
                        }
                    }
                }


                for(let i = 0; i < spawns.length; i++){
                    if(enemies.filter(e => e.dead === false && e.type !== 'bullet').length > 30)break;// leaves room for 18 spawns bc 12 will always be rocks
                    if(spawns[i].type === 'evilflower'){
                        for(let j = 0; j < spawns[i].petals.length; j++){
                            // we make sure that its all rock petals
                            spawns[i].petals[j] = new RockPetal(spawns[i].rarity, Math.PI * 2 * j / spawns[i].petals.length, spawns[i]);
                            spawns[i].petals[j].r *= Math.min(2, Math.sqrt(spawns[i].r / 23.5)) * 2;
                            spawns[i].petals[j].rechargeTime *= 2;

                            // applying nerfs?
                            // this.petals[i].maxHp = Math.sqrt(this.petals[i].maxHp) * 3;
                            // this.petals[i].hp = Math.sqrt(this.petals[i].maxHp) * 3;

                            // this.petals[i].damage = Math.sqrt(this.petals[i].damage) / 5;

                            // this.petals[i].r *= Math.min(2, Math.sqrt(this.r / 23.5));

                            // this.petals[i].rechargeTime *= 2;
                        }
                        spawns[i].hp *= 1.5**this.bossLevel;
                        spawns[i].maxHp *= 1.5**this.bossLevel;
                    }
                    spawns[i].x = this.x + Math.cos(spawnAngle) * this.r;
                    spawns[i].y = this.y + Math.sin(spawnAngle) * this.r;
                    enemies.push(spawns[i]);
                    broadcastInRoom(roomLocation, {
                        newEnemy: spawns[i].initPack()
                    });
                }

                if(this.jumpTime >= 1){
                    this.jumpTime = 0;
                    this.cooldown = 2400;
                    this.jumping = false;
                    this.attackNumber = Math.floor(Math.random()*3);
                }
            }
        }


        if (enemies.filter(e => e.dead === false && e.type !== 'bullet').length < 12){
            let spawn;
            let rand = Math.random();
            if (rand < 0.01) {
                spawn = new Rock('omnipotent', this.dimensions);
            } else if (rand < 0.2) {
                spawn = new Rock('legendary', this.dimensions);
            } else if (rand < 0.5) {
                spawn = new Rock('epic', this.dimensions);
            } else if (rand < 0.8) {
                spawn = new Rock('rare', this.dimensions);
            } else if (rand < 0.9) {
                spawn = new Rock('unusual', this.dimensions);
            } else {
                spawn = new Rock('common', this.dimensions);
            }
            spawn.x = Math.random() * this.dimensions.x;
            spawn.y = Math.random() * this.dimensions.y;
            enemies.push(spawn);
            broadcastInRoom(roomLocation, {
                newEnemy: spawn.initPack()
            });
        }
    }
    initPack() {
        return this;
    }
    updatePack() {
        if (this.dead === true) {
            return {
                dead: true
            }
        } else {
            if(this.rarity === 'boss'){
                return {
                    x: this.x,
                    y: this.y,
                    hp: this.hp,
                    r: this.r
                };
            } else {
                return {
                    x: this.x,
                    y: this.y,
                    hp: this.hp,
                };
            }
        }
    }
    drop(dimensions) {
        const drops = [];
        // on death, spawn these kinds of petals
        if (this.rarity == "boss"){
          drops.push(new RockPetalSlot(this));
          if (this.bossLevel >= 4){
            drops.push(new RockPetalSlot(this));
            drops.push(new RockPetalSlot({...this, rarity: "supreme"}));
          }
        }
         else{
        if (Math.random() < 0.18 && rarityToScalar[this.rarity] - 2 > 0) {
            drops.push(new RockPetalSlot({
                ...this,
                rarity: scalarToRarity[rarityToScalar[this.rarity] - 2]
            }));
        }
        if (Math.random() < 0.32 && rarityToScalar[this.rarity] - 1 > 0) {
            drops.push(new RockPetalSlot({
                ...this,
                rarity: scalarToRarity[rarityToScalar[this.rarity] - 1]
            }));
        }
        if (Math.random() < 0.55) {
            drops.push(new RockPetalSlot(this));
        }
        }

        if (drops.length > 1) {
            // change the petals to a circle so that they dont overlap
            const angleIncrement = Math.PI * 2 / drops.length;
            const distance = 50;
            for (let i = 0; i < drops.length; i++) {
                const angle = i * angleIncrement;

                drops[i].intialX = drops[i].x;
                drops[i].initialY = drops[i].y;

                drops[i].x += Math.cos(angle) * distance;
                drops[i].y += Math.sin(angle) * distance;
            }
        }

        for (let i = 0; i < drops.length; i++) {
            drops[i].boundWalls(dimensions);
        }

        return drops;
    }
}

class Cactus {
    constructor(rarity, dimensions, bossLevel) {
      this.bossLevel = bossLevel ?? 0;
        const scalar = rarityToScalar[rarity];
        this.r = (6 * (scalar ** 2.25) - 4) * (0.8 + Math.random() * 0.4) * 1.25;
        if (rarity === 'common') {
            this.r = 7 + Math.random() * 6;
        }
        // if(rarity === 'omnipotent'){
        //     this.r *= 3;
        // }
        this.rarity = rarity;
        this.x = Math.random() * (dimensions.x - this.r * 2) + this.r;
        this.y = Math.random() * (dimensions.y - this.r * 2) + this.r;
        this.type = 'cactus';

        // this.hp = (this.r+10)**(1.85)/12+8;
        // this.damage = 4*scalar**2.15/1.2;// omni = 1shot anyone, common = 1/25 of your hp

        // haha's ver
        // this.hp = 10 + 10 * (3 ** scalar) //enemyStats[this.type][this.rarity].hp;
        // this.damage = 3 * (1.15 ** scalar) //enemyStats[this.type][this.rarity].damage;

        this.hp = 10+10*(1.85**scalar)//enemyStats[this.type][this.rarity].hp;
        this.damage = 3*(1.1**scalar)//enemyStats[this.type][this.rarity].damage;

        this.impulse = {
            x: 0,
            y: 0
        };

        this.dead = false;

        this.dimensions = dimensions;

        if (rarity === 'boss') {
            this.bossLevel = bossLevel;
            this.r *= 1.8;
            this.hp *= 9;

            this.cooldown = 2000;
            this.destination = {
                x: 0,
                y: 0
            };

            this.jumpTime = 0;
            this.jumping = false;

            this.initial = {x: 0, y: 0};
            this.initialRadius = this.r;

            this.attackNumber = Math.floor(Math.random()*2);

            this.hp *= 2/*.5*/**bossLevel;
            this.maxHp = this.hp;
            let radiusIncrease = 1.1**bossLevel;
            if (radiusIncrease > 2){
              radiusIncrease = 2;
            }
            this.r *= radiusIncrease;
            this.cooldown *= 0.8**bossLevel;
        }

        this.maxHp = this.hp;
    }
    simulate(dt, players, enemies, roomLocation) {
        if (this.rarity !== 'boss') return;
        this.cooldown -= dt+this.bossLevel/2;
        if (this.cooldown < 0) {
            if(this.attackNumber === 0){
                if(this.jumping === false){
                    const angle = Math.random()*Math.PI*2;
                    this.destination = {
                        x: this.x + Math.cos(angle)*2000,//Math.random() * (this.dimensions.x - this.r * 2) + this.r,
                        y: this.y + Math.sin(angle)*2000//Math.random() * (this.dimensions.x - this.r * 2) + this.r
                    };
                    this.initial = {x: this.x, y: this.y};
                    this.jumping = true;
                }

                this.jumpTime += 0.02+this.bossLevel/100;
                // jump around
                if(this.jumpTime < 0.2){
                    // shrink radius
                    const t = this.jumpTime*5;
                    this.r = (1-t)*this.initialRadius + t*(this.initialRadius/1.5);
                } else if(this.jumpTime < 0.8){
                    // move to this.destination
                    const t = ((this.jumpTime - 0.2) / 0.8);// **2 to give scaling movement
                    this.x = (1-t)*this.initial.x + t*this.destination.x;
                    this.y = (1-t)*this.initial.y + t*this.destination.y;
                } else if (this.jumpTime < 1) {
                    // grow radius
                    const t = (this.jumpTime-0.8)*5;
                    this.r = t*this.initialRadius + (1-t)*(this.initialRadius/1.5);
                } else if(this.jumpTime >= 1){
                    this.jumpTime = 0;
                    this.cooldown = 2000;
                    this.jumping = false;
                    this.attackNumber = Math.floor(Math.random()*2.25);
                }
            } else if(this.attackNumber === 1) {
                // rock grows bigger and then goes smaller again
                this.jumpTime += 0.02+this.bossLevel/100;
                if(this.jumpTime < 0.4){
                    const t = this.jumpTime*2.5;
                    this.r = t*this.initialRadius*1.3 + (1-t)*(this.initialRadius);
                } else if(this.jumpTime >= 1){
                    this.jumpTime = 0;
                    this.cooldown = 2000;
                    this.jumping = false;
                    this.attackNumber = Math.floor(Math.random()*2.25);
                } else if(this.jumpTime > 0.6){
                    const t = (this.jumpTime-0.6)*2.5;
                    this.r = t*this.initialRadius + (1-t)*(this.initialRadius*1.3);
                }
            } else if(this.attackNumber === 2) {
                // only to be used on boss+ or above
                if(this.bossLevel == 0){
                    this.jumpTime = 0;
                    this.cooldown = 0;
                    this.jumping = false;
                    this.attackNumber = Math.floor(Math.random()*2);
                }
                this.jumpTime += (0.2 + this.bossLevel / 100) * 3/2;
                const spawnAngle = this.jumpTime * Math.PI * 2;// 2 pi

                let rand = Math.random();
                let spawns = [];
                if(Math.random() < 0.5){
                    // spawn diep that shoots rock bullets and is rendered with rock color tank base
                    if(rand < 0.3){
                        spawns = [new Diep('epic', this.dimensions, 0, true)];
                    } else if(rand < 0.6) {
                        spawns = [new Diep('legendary', this.dimensions, 0, true)];
                    } else if(rand < 0.9){
                        spawns = [new Diep('omnipotent', this.dimensions, 0, true)];
                    } else {
                        for(let i = 0; i < 10; i++){
                            // spawn 10
                            spawns.push(new Diep('rare', this.dimensions, 0, true));
                        }
                    }
                } else {
                    if(rand < 0.3){
                        for(let i = 0; i < 2; i++){
                            spawns.push(new EvilFlower('epic', this.dimensions, roomLocation));
                        }
                    } else if(rand < 0.6) {
                        spawns = [new EvilFlower('legendary', this.dimensions, roomLocation)];
                    } else if(rand < 0.9){
                        spawns = [new EvilFlower('omnipotent', this.dimensions, roomLocation)];
                    } else {
                        for(let i = 0; i < 10; i++){
                            // spawn 10
                            spawns.push(new EvilFlower('rare', this.dimensions, roomLocation));
                        }
                    }
                }


                for(let i = 0; i < spawns.length; i++){
                    if(enemies.filter(e => e.dead === false && e.type !== 'bullet').length > 30)break;// leaves room for 18 spawns bc 12 will always be rocks
                    if(spawns[i].type === 'evilflower'){
                        for(let j = 0; j < spawns[i].petals.length; j++){
                            // we make sure that its all rock petals
                            spawns[i].petals[j] = new CactusPetal(spawns[i].rarity, Math.PI * 2 * j / spawns[i].petals.length, spawns[i]);
                            spawns[i].petals[j].r *= Math.min(2, Math.sqrt(spawns[i].r / 23.5)) * 2;
                            spawns[i].petals[j].rechargeTime *= 2;

                            // applying nerfs?
                            // this.petals[i].maxHp = Math.sqrt(this.petals[i].maxHp) * 3;
                            // this.petals[i].hp = Math.sqrt(this.petals[i].maxHp) * 3;

                            // this.petals[i].damage = Math.sqrt(this.petals[i].damage) / 5;

                            // this.petals[i].r *= Math.min(2, Math.sqrt(this.r / 23.5));

                            // this.petals[i].rechargeTime *= 2;
                        }
                        spawns[i].hp *= 1.5**this.bossLevel;
                        spawns[i].maxHp *= 1.5**this.bossLevel;
                    }
                    spawns[i].x = this.x + Math.cos(spawnAngle) * this.r;
                    spawns[i].y = this.y + Math.sin(spawnAngle) * this.r;
                    enemies.push(spawns[i]);
                    broadcastInRoom(roomLocation, {
                        newEnemy: spawns[i].initPack()
                    });
                }

                if(this.jumpTime >= 1){
                    this.jumpTime = 0;
                    this.cooldown = 2400;
                    this.jumping = false;
                    this.attackNumber = Math.floor(Math.random()*3);
                }
            }
        }


        if (enemies.filter(e => e.dead === false && e.type !== 'bullet').length < 12){
            let spawn;
            let rand = Math.random();
            if (rand < 0.01) {
                spawn = new Cactus('omnipotent', this.dimensions);
            } else if (rand < 0.2) {
                spawn = new Cactus('legendary', this.dimensions);
            } else if (rand < 0.5) {
                spawn = new Cactus('epic', this.dimensions);
            } else if (rand < 0.8) {
                spawn = new Cactus('rare', this.dimensions);
            } else if (rand < 0.9) {
                spawn = new Cactus('unusual', this.dimensions);
            } else {
                spawn = new Cactus('common', this.dimensions);
            }
            spawn.x = Math.random() * this.dimensions.x;
            spawn.y = Math.random() * this.dimensions.y;
            enemies.push(spawn);
            broadcastInRoom(roomLocation, {
                newEnemy: spawn.initPack()
            });
        }
    }
    initPack() {
        return this;
    }
    updatePack() {
        if (this.dead === true) {
            return {
                dead: true
            }
        } else {
            if(this.rarity === 'boss'){
                return {
                    x: this.x,
                    y: this.y,
                    hp: this.hp,
                    r: this.r
                };
            } else {
                return {
                    x: this.x,
                    y: this.y,
                    hp: this.hp,
                };
            }
        }
    }
    drop(dimensions) {
        const drops = [];
        // on death, spawn these kinds of petals
        if (this.rarity == "boss"){
          drops.push(new CactusPetalSlot(this));
          if (this.bossLevel >= 4){
            drops.push(new CactusPetalSlot(this));
            drops.push(new CactusPetalSlot({...this, rarity: "supreme"}));
          }
        }
         else{
        if (Math.random() < 0.18 && rarityToScalar[this.rarity] - 2 > 0) {
            drops.push(new CactusPetalSlot({
                ...this,
                rarity: scalarToRarity[rarityToScalar[this.rarity] - 2]
            }));
        }
        if (Math.random() < 0.32 && rarityToScalar[this.rarity] - 1 > 0) {
            drops.push(new CactusPetalSlot({
                ...this,
                rarity: scalarToRarity[rarityToScalar[this.rarity] - 1]
            }));
        }
        if (Math.random() < 0.55) {
            drops.push(new CactusPetalSlot(this));
        }
        }

        if (drops.length > 1) {
            // change the petals to a circle so that they dont overlap
            const angleIncrement = Math.PI * 2 / drops.length;
            const distance = 50;
            for (let i = 0; i < drops.length; i++) {
                const angle = i * angleIncrement;

                drops[i].intialX = drops[i].x;
                drops[i].initialY = drops[i].y;

                drops[i].x += Math.cos(angle) * distance;
                drops[i].y += Math.sin(angle) * distance;
            }
        }

        for (let i = 0; i < drops.length; i++) {
            drops[i].boundWalls(dimensions);
        }

        return drops;
    }
}

class EvilFlower {
    constructor(rarity, dimensions, roomLocation, bossLevel) {
        this.bossLevel = bossLevel;
        const scalar = rarityToScalar[rarity];
        this.r = 12 + 4 * (scalar ** 2); //(6*(scalar**2.25)-4)*(0.8+Math.random()*0.4)*1.25;

        this.rarity = rarity;
        this.x = Math.random() * (dimensions.x - this.r * 2) + this.r;
        this.y = Math.random() * (dimensions.y - this.r * 2) + this.r;
        this.type = 'evilflower';

        // common 60 - omni 10k
        // this.hp = ((this.r+2)**(1.65)/4)**1.5/2+16;

        // haha's ver
        // this.hp = 4 + 5 * (3 ** scalar); //enemyStats[this.type][this.rarity].hp;
        // this.damage = 8 + scalar;

        this.hp = 4+5*(1.6**scalar);//enemyStats[this.type][this.rarity].hp;
        this.damage = 8+scalar;

        this.maxHp = this.hp;

        // this.damage = 10//4*scalar**2.25;// omni = 1shot anyone, common = 1/25 of your hp

        this.impulse = {
            x: 0,
            y: 0
        };

        this.dead = false;

        // nod to how afk flowers look
        this.angle = Math.random() * Math.PI * 2;
        this.magnitude = 45;

        this.maxSpeed = 80;
        if (rarity === 'boss') {
            this.maxSpeed *= 2.2;
            this.maxSpeed += bossLevel;
            this.r *= 2.5;

            this.hp *= 12*2.8**bossLevel;
            this.maxHp = this.hp;
            let radiusIncrease = 1.1**bossLevel;
            if (radiusIncrease > 2){
              radiusIncrease = 2;
            }
            this.r *= radiusIncrease;
        }

        this.roomLocation = roomLocation;

        this.basePetalDistance = petalDistance * this.r / 23.5;
        this.petalDistance = this.basePetalDistance;
        this.desiredPetalDistance = this.basePetalDistance;

        this.attacking = false;
        this.defending = false;

        // defining petals
        let petalSlots = Math.ceil(scalar / 2) + 2;

        if (this.rarity === 'boss') {
            petalSlots = 16+bossLevel*2;
        }

        // if(scalar <= 2){// uncommon
        //     petalSlots = 5;
        // } else if(scalar <= 4){// epic
        //     petalSlots = 6;
        // } else if(scalar <= 5) {// legendary
        //     petalSlots = 7;
        // } else {
        //     petalSlots = 8;
        // }

        this.petals = [];
        for (let i = 0; i < petalSlots; i++) {
            if(this.rarity === 'boss'){
                const random = Math.random();
                if (random < 0.425) {
                    this.petals[i] = new BasicPetal(this.rarity, Math.PI * 2 * i / petalSlots, this);
                } else if (random < 0.85) {
                    this.petals[i] = new RockPetal(this.rarity, Math.PI * 2 * i / petalSlots, this);
                } else {
                    // >:)
                    this.petals[i] = new DiepPetal(this.rarity, Math.PI * 2 * i / petalSlots, this, this.roomLocation);// it wont even collide btw lool
                }
            } else {
                if (Math.random() < 0.5) {
                    this.petals[i] = new BasicPetal(this.rarity, Math.PI * 2 * i / petalSlots, this);
                } else {
                    this.petals[i] = new RockPetal(this.rarity, Math.PI * 2 * i / petalSlots, this);
                }
            }

            // nerfing them because raw petals are too op
            this.petals[i].maxHp = Math.sqrt(this.petals[i].maxHp) * 3;
            this.petals[i].hp = Math.sqrt(this.petals[i].maxHp) * 3;

            this.petals[i].damage = Math.sqrt(this.petals[i].damage) / 5;

            this.petals[i].r *= Math.min(2, Math.sqrt(this.r / 23.5));

            this.petals[i].rechargeTime *= 2;

            if (rarity === 'boss') {
                this.petals[i].rechargeTime *= 12;
                this.petals[i].r *= 6*1.2**bossLevel;
                this.petals[i].maxHp *= 25*1.1**bossLevel;
                this.petals[i].hp *= 30*1.1**bossLevel;
                this.petals[i].damage *= 5*1.1**bossLevel;
                if(this.petals[i].bulletRadius !== undefined){
                    // this.petals[i].bulletRadius *= 12;
                    this.petals[i].r *= 1.1;
                    this.petals[i].bulletRadius = this.petals[i].r * 7 / 15;
                    this.petals[i].bulletSpeed /= 2.2;
                    this.petals[i].cooldown /= 1+(bossLevel)/4;
                    this.petals[i].maxCooldown /= 1+(bossLevel)/4;
                    this.petals[i].bulletHp *= 1.2**bossLevel;
                    this.petals[i].bulletDamage *= 1.2**bossLevel;
                }

                // making an outer ring
                if (i % 2 === 0) {
                    this.petals[i].rotationSpeed *= -1;
                }

                this.petals[i].rotationSpeed *= 1.2*0.95**bossLevel;

                // recoil to make it more interesting
                this.maxRecoilTimer = 16000;
                this.recoilTimer = this.maxRecoilTimer;
            }
        }
    }
    recoilPlayers(players, amount = 1) {
        for (let id in players) {
            const angle = Math.atan2(players[id].y - this.y, players[id].x - this.x);
            const distance = Math.sqrt((players[id].y - this.y) ** 2 + (players[id].x - this.x) ** 2);
            // console.log('impulse' + (Math.cos(angle) * 30000/distance), Math.sin(angle) * 30000/distance);
            players[id].impulse.x += Math.cos(angle) * 1000000 / distance * amount;
            players[id].impulse.y += Math.sin(angle) * 1000000 / distance * amount;
        }
    }
    simulate(dt, players) {
        // ok so the ai is very simple
        // basically what it does is detects the nearest player
        // if it notices:
        // it moves in a direction and tries to maintain a distance of the petals expanded
        // if player is closer then the petals also retract

        // else:
        // moves like an afk florr mob

        let nearestId = null;
        let nearestDistance = 300 * Math.sqrt(this.r / 23.5); // max distance
        for (let id in players) {
            if (Math.hypot(players[id].x - this.x, players[id].y - this.y) < nearestDistance) {
                nearestDistance = Math.hypot(players[id].x - this.x, players[id].y - this.y);
                nearestId = id;
            }
        }

        if (nearestId !== null) {
            const distance = Math.hypot(players[nearestId].x - this.x, players[nearestId].y - this.y);
            this.angle = Math.atan2(players[nearestId].y - this.y, players[nearestId].x - this.x);
            this.magnitude = Math.min(this.maxSpeed, Math.hypot(players[nearestId].x - this.x, players[nearestId].y - this.y));

            if (distance > this.basePetalDistance * 1.8) {
                this.desiredPetalDistance = this.basePetalDistance * 2.15;
            }
            /*else if(distance < this.basePetalDistance * 0.8) { // defending looks kinda bad
                           this.desiredPetalDistance = this.basePetalDistance * 0.6;
                       }*/
            else {
                this.desiredPetalDistance = this.basePetalDistance;
            }
        } else {
            this.desiredPetalDistance = this.basePetalDistance;
        }

        const xv = Math.cos(this.angle) * this.magnitude * playerSpeed + this.impulse.x;
        const yv = Math.sin(this.angle) * this.magnitude * playerSpeed + this.impulse.y;

        this.x += xv * dt / 1000;
        this.y += yv * dt / 1000;

        this.impulse.x *= Math.pow( /*this.friction*/ 0.8, dt * 15);
        this.impulse.y *= Math.pow( /*this.friction*/ 0.8, dt * 15);

        this.petalDistance += (this.desiredPetalDistance - this.petalDistance) - (this.desiredPetalDistance - this.petalDistance) * Math.pow(0.985, dt);

        if(this.rarity === 'boss'){
            const basePetalDistance = this.petalDistance;
            for (let i = 0; i < this.petals.length; i++) {
                if (i % 2 === 0) {
                    this.petalDistance = basePetalDistance / 1.5;
                } else {
                    this.petalDistance = basePetalDistance;
                }
                this.petals[i].simulate(this, dt, Object.values(players));
            }
            this.petalDistance = basePetalDistance;

            // also simulate recoil
            this.recoilTimer -= dt;

            if(this.recoilTimer <= 0){
                this.recoilTimer = this.maxRecoilTimer;
                this.recoilPlayers(players, 30+3*this.bossLevel);
            }
        } else {
            for (let i = 0; i < this.petals.length; i++) {
                this.petals[i].simulate(this, dt);
            }
        }
    }
    initPack() {
        return this;
    }
    updatePack() {
        if (this.dead === true) {
            return {
                dead: true,
                petals: this.petals.map(p => p.updatePack())
            }
        } else {
            if(this.rarity === 'boss' && this.recoilTimer <= 2000){// we only render if its <2000
                return {
                    x: this.x,
                    y: this.y,
                    hp: this.hp,
                    attacking: this.attacking,
                    defending: this.defending,
                    petalDistance: this.petalDistance,
                    petals: this.petals.map(p => p.updatePack()),
                    angle: this.angle,
                    magnitude: this.magnitude,
                    recoilTimer: this.recoilTimer
                };
            } else {
                return {
                    x: this.x,
                    y: this.y,
                    hp: this.hp,
                    attacking: this.attacking,
                    defending: this.defending,
                    petalDistance: this.petalDistance,
                    petals: this.petals.map(p => p.updatePack()),
                    angle: this.angle,
                    magnitude: this.magnitude,
                };
            }

        }
    }
    drop(dimensions) {
        for (let i = 0; i < this.petals.length; i++) {
            this.petals[i].hp = -1;
        }// WHAT HAVE U DONE HAHA  added a boss petal rarity LOL )
        // and boss+? not yet
        // check where the function is being called
        // bsoses are probably exempt when fn called somewhere in room or index
        // good how the hell do bosses not drop drops
        const drops = [];

        // on death, spawn these kinds of petals
        if (this.rarity == "boss"){
          if (Math.random() < 0.25){
            drops.push(new RockPetalSlot(this));
            if (this.bossLevel >= 4){
            drops.push(new RockPetalSlot(this));
            drops.push(new RockPetalSlot({...this, rarity: "supreme"}));
            }
          }
          else{
            drops.push(new BasicPetalSlot(this));
            if (this.bossLevel >= 4){
            drops.push(new BasicPetalSlot(this));
            drops.push(new BasicPetalSlot({...this, rarity: "supreme"}));
            }
          }
        }
         else{
        for (let i = 0; i < this.petals.length; i++) {
            if (Math.random() < 0.44) { // 44 percent chance to drop a petal that it's carrying -1 rarity
                const rarity = this.rarity; //Math.random() < 0.44 ? this.rarity : scalarToRarity[Math.max(rarityToScalar[this.rarity]-1, 0)];
                if (this.petals[i].type === 'rockpetal') {
                    drops.push(new RockPetalSlot({
                        ...this,
                        rarity
                    }));
                } else {
                    // basic
                    drops.push(new BasicPetalSlot({
                        ...this,
                        rarity
                    }));
                }
            }
        }
         }

        if (drops.length > 1) {
            // change the petals to a circle so that they dont overlap
            const angleIncrement = Math.PI * 2 / drops.length;
            const distance = 50;
            for (let i = 0; i < drops.length; i++) {
                const angle = i * angleIncrement;

                drops[i].intialX = drops[i].x;
                drops[i].initialY = drops[i].y;

                drops[i].x += Math.cos(angle) * distance;
                drops[i].y += Math.sin(angle) * distance;
            }
        }

        for (let i = 0; i < drops.length; i++) {
            drops[i].boundWalls(dimensions);
        }

        return drops;
    }
}

// ant hole
class Portal {
    constructor(rarity, dimensions, side) {
        const scalar = rarityToScalar[rarity];
        this.r = (10 * (scalar ** 1.5) + 4);
        this.rarity = rarity;

        this.hp = 1;

        const padding = 1.3 * this.r;
        // 0: left, 1: down, 2: right, 3: up
        if (side === 'left') {
            this.x = padding;
            this.y = dimensions.y / 2;
        } else if (side === 'right') {
            this.x = dimensions.x - padding;
            this.y = dimensions.y / 2;
        } else if (side === 'down') {
            this.x = dimensions.x / 2;
            this.y = dimensions.y - padding;
        } else if (side === 'up') {
            this.x = dimensions.x / 2;
            this.y = padding;
        } else if (side === 'boss') {
            // top right
            this.golden = true;
            this.x = dimensions.x - padding;
            this.y = padding;
        } else if(side === 'win') {
            this.golden = 'diamond';
            this.x = dimensions.x / 2;
            this.y = dimensions.y / 2;
        }

        this.side = side;

        this.type = 'portal';
    }
    simulate(dt, players) {
        // for(let id of players){
        //     if()
        // }
    }
    initPack() {
        return this;
    }
    updatePack() {
        return {
            x: this.x,
            y: this.y //temp
        };
    }
}

class Diep {
    constructor(rarity, dimensions, bossLevel, isRock=false/*rock boss minion*/) {
        this.bossLevel = bossLevel;
        const scalar = rarityToScalar[rarity];
        this.r = (scalar) ** 1.22 * 15;

        this.rarity = rarity;
        this.x = Math.random() * (dimensions.x - this.r * 2) + this.r;
        this.y = Math.random() * (dimensions.y - this.r * 2) + this.r;
        this.type = 'diep';

        // this.hp = (this.r+6)**(2.3)/12+12;

        // haha's ver
        // this.hp = 2 + 5 * (3 ** scalar) //enemyStats[this.type][this.rarity].hp;
        // this.damage = 6 + 3 * (1.1 ** scalar) //enemyStats[this.type][this.rarity].damage;

        // OLD
        this.hp = 2+5*(1.8**scalar)//enemyStats[this.type][this.rarity].hp;
        this.damage = 6+3*(1.1**scalar)//enemyStats[this.type][this.rarity].damage

        this.maxHp = this.hp;

        this.isRock = isRock;

        // this.damage = 2.5*scalar**1.5;// omni = 1shot anyone, common = 1/25 of your hp

        this.impulse = {
            x: 0,
            y: 0
        };

        this.dead = false;

        // nod to how afk flowers look
        this.angle = Math.random() * Math.PI * 2;
        this.magnitude = 5;

        this.maxCooldown = 1600 + 400 / scalar;
        this.cooldown = this.maxCooldown * 0.8;

        this.dimensions = dimensions;

        this.detectionDistance = Math.max(200, this.r * 20);
        this.chaseDistance = 61.1 * 2 + this.r * 4;
        this.retreatDistance = 61.1 * 2 + this.r;

        this.recoil = 0;

        this.bossLevel = 0;

        if (rarity === 'boss') {
            this.detectionDistance *= 1000;
            this.chaseDistance *= 3;
            this.retreatDistance = -100; // never retreat!
            this.maxCooldown = 360;
            this.hp *= 8;
            this.damage *= 1.5;
            this.maxHp *= 8;
            this.r *= 3;

            this.gunIndex = 0;

            this.x = dimensions.x / 2;
            this.y = dimensions.y / 2;

            // if the boss is performing an attack or not
            this.attacking = false;
            // attack-specific cooldown
            this.attackCooldown = 1000;

            // warning sign for attacks
            this.redTimer = -1;
            this.timerColor = 'red';// color of the barrels
            // this.redTimerSpeed = 0;

            this.hp *= 2.3**bossLevel;
            this.maxHp = this.hp;
            this.r *= Math.min(2,1.1**bossLevel);

            this.bossLevel = bossLevel;
        }
    }
    simulate(dt, players, enemies, roomLocation) {
        // ai is just like the old florrclone diep ai
        // circles around you and shoots bullets when cooldown is up

        this.cooldown -= dt+this.bossLevel/3;

        if (this.rarity === 'boss') {
            // boss tank behavior
            // idea: 3 attacks
            // waits 600-1000ms before each attack
            // performs the attack and then does another one
            // attacks:
            // 0: spins around and releases a lot of bullets in a spiral pattern
            // 1: spawns 3 sets of bullets from all 8 guns 100ms apart
            // 2: spawns some mini diep tanks
            // 3: shoots 1 set of big bullets
            this.x = this.dimensions.x / 2;
            this.y = this.dimensions.y / 2;

            this.redTimer -= dt //* this.redTimerSpeed / 1000;

            if (this.cooldown <= 0) {
                if (this.attacking === false) {
                    this.attackNumber = Math.floor(Math.random() * 4);
                    if (this.attackNumber === 0) {
                        this.attackCooldown = 1400;
                        this.attacksLeft = 8+this.bossLevel*2;
                        this.redTimer = 1400;
                        this.timerColor = this.gunIndex % 8;
                        // this.redTimerSpeed = 2000;
                        // this.timerColor = 'green'; // will be an array of shootAngles
                    } else if (this.attackNumber === 1) {
                        this.attacksLeft = 3+this.bossLevel;
                        this.attackCooldown = 600;
                        this.redTimer = 600;
                        // this.redTimerSpeed = 2500;
                        this.timerColor = 'blue';
                    } else if (this.attackNumber === 2) {
                        this.attacksLeft = 2+this.bossLevel**2; // spawn 2 omni tanks
                        this.attackCooldown = 800;
                    } else {
                        this.attacksLeft = 2;
                        this.attackCooldown = 2800;
                        this.redTimer = 2800;
                        // this.redTimerSpeed = 1000;
                        this.timerColor = 'red';
                    }
                    this.attacking = true;
                }

                if (this.attackNumber === 0) {
                    // ATTACK 0
                    this.attackCooldown -= dt;
                    this.angle += dt * Math.PI * 0.00014;

                    if (this.attackCooldown < 0) {
                        this.attacksLeft--;
                        this.attackCooldown = 400;

                        // if (this.gunIndex === 0) {
                        //     this.recoilPlayers(players, 5);
                        // }

                        let shootAngles = [
                            this.angle + Math.PI * 2 / 8 * (this.gunIndex % 8),
                            this.angle + Math.PI * 2 / 8 * ((this.gunIndex + 4) % 8)
                        ]

                        const spawns = [
                            new Bullet(this.rarity, this.dimensions, {
                                ...this,
                                angle: shootAngles[0]
                            }),
                            new Bullet(this.rarity, this.dimensions, {
                                ...this,
                                angle: shootAngles[1]
                            }),
                        ];

                        enemies.push(spawns[0]);
                        broadcastInRoom(roomLocation, {
                            newEnemy: spawns[0].initPack()
                        });

                        enemies.push(spawns[1]);
                        broadcastInRoom(roomLocation, {
                            newEnemy: spawns[1].initPack()
                        });

                        // this.recoil = 10;

                        this.gunIndex++;
                        if (this.gunIndex > 7) {
                            this.gunIndex = 0;
                        }

                        if (this.attacksLeft <= 0) {
                            this.cooldown = 3200;
                            this.attacking = false;
                        }
                    }
                } else if (this.attackNumber === 1) {
                    // ATTACK 1
                    this.attackCooldown -= dt;

                    if (this.attackCooldown < 0) {
                        this.attacksLeft--;
                        this.attackCooldown = 1000;
                        // this.recoilPlayers(players, 3);

                        for (let i = 0; i < 8; i++) {
                            const spawn = new Bullet(this.rarity, this.dimensions, {
                                ...this,
                                angle: this.angle + Math.PI * 2 * i / 8
                            });
                            enemies.push(spawn);
                            broadcastInRoom(roomLocation, {
                                newEnemy: spawn.initPack()
                            });
                        }

                        if (this.attacksLeft <= 0) {
                            this.cooldown = 1400;
                            this.attacking = false;
                        }
                    }
                } else if (this.attackNumber === 2) {
                    // ATTACK 3
                    this.attackCooldown -= dt;

                    if (this.attackCooldown < 0) {
                        this.attacksLeft--;
                        this.attackCooldown = 600;

                        // spawn omni diep
                        let spawn;
                        if (Math.random() < 0.1) {
                            if (Math.random() < 0.01) {// 1% chance lmao
                                spawn = new Diep('boss', this.dimensions);
                            } else {
                                spawn = new Diep('omnipotent', this.dimensions);
                            }
                        } else {
                            spawn = new Diep('legendary', this.dimensions);
                        }
                        const spawnAngle = Math.random() * Math.PI * 2;
                        spawn.x = this.x + Math.cos(spawnAngle) * ( /*spawn.r +*/ this.r);
                        spawn.y = this.y + Math.sin(spawnAngle) * ( /*spawn.r +*/ this.r);
                        spawn.hp *= 1.5**this.bossLevel;
                        spawn.maxHp *= 1.5**this.bossLevel;
                        enemies.push(spawn);
                        broadcastInRoom(roomLocation, {
                            newEnemy: spawn.initPack()
                        });

                        if (this.attacksLeft <= 0) {
                            this.cooldown = 4600;
                            this.attacking = false;
                        }
                    }
                } else {
                    // ATTACK 4
                    this.attackCooldown -= dt;
                    this.angle -= dt * Math.PI * 0.00028 * this.attackCooldown / 1600;

                    if (this.attackCooldown < 0) {
                        this.attackCooldown = 1000;
                        this.recoilPlayers(players, 5);

                        for (let i = 0; i < 8; i++) {
                            const spawn = new Bullet('bossattack3', this.dimensions, {
                                ...this,
                                angle: this.angle + Math.PI * 2 * i / 8,
                                r: this.r * 1.5
                            });
                            enemies.push(spawn);
                            broadcastInRoom(roomLocation, {
                                newEnemy: spawn.initPack()
                            });
                        }

                        this.cooldown = 2050 + 1000;
                        this.attacking = false;
                    }
                }
            }
        } else {
            // normal tank behavior
            let nearestId = null;
            let nearestDistance = this.detectionDistance;
            for (let id in players) {
                if (Math.hypot(players[id].x - this.x, players[id].y - this.y) < nearestDistance) {
                    nearestDistance = Math.hypot(players[id].x - this.x, players[id].y - this.y);
                    nearestId = id;
                }
            }

            if (nearestId !== null) {
                this.angle = Math.atan2(players[nearestId].y - this.y, players[nearestId].x - this.x);
                if (nearestDistance > this.chaseDistance) {
                    this.magnitude = Math.min(this.magnitude + 0.8, 8);
                } else if (nearestDistance < this.retreatDistance) {
                    this.magnitude = Math.max(this.magnitude - 0.8, -6);
                } else {
                    this.magnitude *= 0.8;
                }

                if (this.cooldown <= 0) {
                    this.cooldown = Math.max(this.maxCooldown * 0.8, this.cooldown + this.maxCooldown);
                    if(this.isRock === true){
                        this.cooldown *= 0.8;
                    }

                    const spawn = new Bullet(this.rarity, this.dimensions, this);

                    enemies.push(spawn);
                    broadcastInRoom(roomLocation, {
                        newEnemy: spawn.initPack()
                    });

                    this.recoil = 10;
                }
            } else {
                this.magnitude *= 0.9;
                this.angle += dt * Math.PI * 0.0002;
            }
        }

        this.x += Math.cos(this.angle) * (this.magnitude - this.recoil);
        this.y += Math.sin(this.angle) * (this.magnitude - this.recoil);

        this.recoil *= Math.pow(0.98, dt);
    }
    recoilPlayers(players, amount = 1) {
        for (let id in players) {
            const angle = Math.atan2(players[id].y - this.y, players[id].x - this.x);
            const distance = Math.sqrt((players[id].y - this.y) ** 2 + (players[id].x - this.x) ** 2);
            // console.log('impulse' + (Math.cos(angle) * 30000/distance), Math.sin(angle) * 30000/distance);
            players[id].impulse.x += Math.cos(angle) * 1000000 / distance * amount;
            players[id].impulse.y += Math.sin(angle) * 1000000 / distance * amount;
        }
    }
    initPack() {
        return this;
    }
    updatePack() {
        if (this.dead === true) {
            return {
                dead: true,
            }
        } else {
            if(this.rarity === 'boss'){
                return {
                    redTimer: this.redTimer,
                    timerColor: this.timerColor,
                    // redTimerSpeed: this.redTimerSpeed,
                    x: this.x,
                    y: this.y,
                    hp: this.hp,
                    angle: this.angle,
                };
            } else {
                return {
                    x: this.x,
                    y: this.y,
                    hp: this.hp,
                    angle: this.angle,
                };
            }
        }
    }
    drop(dimensions) {
        const drops = [];

        // on death, spawn these kinds of petals
        if (this.rarity == "boss"){
          drops.push(new DiepPetalSlot(this));
          if (this.bossLevel >= 4){
            drops.push(new DiepPetalSlot(this));
            drops.push(new DiepPetalSlot({...this, rarity: "supreme"}));
          }
        }
         else{
        if (Math.random() < 0.28 && rarityToScalar[this.rarity] - 1 > 0) {
            drops.push(new DiepPetalSlot({
                ...this,
                rarity: scalarToRarity[rarityToScalar[this.rarity] - 1]
            }));
        }
        if (Math.random() < 0.52) {
            drops.push(new DiepPetalSlot(this));
        }
         }

        if (drops.length > 1) {
            // change the petals to a circle so that they dont overlap
            const angleIncrement = Math.PI * 2 / drops.length;
            const distance = 50;
            for (let i = 0; i < drops.length; i++) {
                const angle = i * angleIncrement;

                drops[i].initialX = drops[i].x;
                drops[i].initialY = drops[i].y;

                drops[i].x += Math.cos(angle) * distance;
                drops[i].y += Math.sin(angle) * distance;
            }
        }
        for (let i = 0; i < drops.length; i++) {
          if (drops[i].rarity == "boss"){
            if (Math.sqrt((drops[i].x - this.dimensions.x/2) ** 2 + (drops[i].y - this.dimensions.y/2) ** 2) < 200){
                let angle = Math.atan2(drops[i].y - this.dimensions.y/2 + Math.random() - 0.5, drops[i].x - this.dimensions.x/2 + Math.random() - 0.5);
                drops[i].x += Math.cos(angle) * 200;
                drops[i].y += Math.sin(angle) * 200;
            }

          }
        }

        for (let i = 0; i < drops.length; i++) {
            drops[i].boundWalls(dimensions);
        }

        return drops;
    }
}

class Bullet {
    constructor(rarity, dimensions, parent) {
        this.x = parent.x + Math.cos(parent.angle) * parent.r;
        this.y = parent.y + Math.sin(parent.angle) * parent.r;

        const scalar = rarityToScalar[rarity];

        this.angle = parent.angle;
        this.magnitude = scalar / 21;

        this.xv = Math.cos(this.angle) * this.magnitude;
        this.yv = Math.sin(this.angle) * this.magnitude;

        this.r = (scalar) ** 1.22 * 7;

        this.rarity = rarity;

        // this.damage = 8 + scalar;
        // this.hp = (3 ** scalar) / 5;

        this.damage = 8+scalar/2;
        this.hp = (1.8**scalar)/5;

        this.type = 'bullet';
        this.life = 3000;

        this.impulse = {
            x: 0,
            y: 0
        };

        this.dead = false;

        this.dimensions = dimensions;

        if (rarity === 'boss') {
            this.hp *= 3.2;
            this.life *= 5;
            this.xv *= 1.4;
            this.yv *= 1.4;
            this.r *= 3;
            this.damage *= 1.8;

            this.r *= Math.min(2,1.1**parent.bossLevel)
        } else if (rarity === 'bossattack3') {
            // special case for 3rd boss attack
            this.hp *= 5.2;
            this.life *= 5;
            this.xv /= 1.8;
            this.yv /= 1.8;
            this.r *= 2.6;
            this.damage *= 2;

            this.r *= Math.min(2,1.1**parent.bossLevel)
        }

        this.isRock = parent.isRock;
        if(this.isRock === true){
            this.hp *= 4;
            this.damage *= 0.8;
            this.life *= 2;
            this.xv /= 1.4;
            this.yv /= 1.4;
        }
    }
    simulate(dt) {
        this.x += this.xv * dt;
        this.y += this.yv * dt;

        this.life -= dt;
        if (this.life < 0) {
            this.dead = true;
        }

        // bounding wall checks
        if (this.x + this.r > this.dimensions.x || this.x - this.r < 0 || this.y + this.r > this.dimensions.y || this.y - this.r < 0) {
            this.dead = true;
        }
    }
    initPack() {
        return this;
    }
    updatePack() {
        if (this.dead === true) {
            return {
                dead: true,
            }
        } else {
            return {
                x: this.x,
                y: this.y,
            };
        }
    }
    drop() {
        return [];
    }
}

class MopeMouse {
    constructor(rarity, dimensions, bossLevel) {
        this.bossLevel = bossLevel ?? 0;
        const scalar = rarityToScalar[rarity];
        this.r = 12 + 4 * (scalar ** 2); //(6*(scalar**2.25)-4)*(0.8+Math.random()*0.4)*1.25;
        this.baseR = this.r;
        this.rarity = rarity;
        this.x = Math.random() * (dimensions.x - this.r * 2) + this.r;
        this.y = Math.random() * (dimensions.y - this.r * 2) + this.r;
        this.type = 'mopemouse';

        // common 60 - omni 10k
        // this.hp = ((this.r+2)**(1.65)/4)**1.5/2+16;

        // haha's ver
        // this.hp = 6 + 5 * (3 ** scalar); //enemyStats[this.type][this.rarity].hp;
        // this.damage = 4 + 1.5 * (1.15 ** scalar)

        this.hp = 4+4*(1.8**scalar);//enemyStats[this.type][this.rarity].hp;
        this.damage = 6+3*(1.3**scalar)

        this.maxHp = this.hp;

        // this.damage = 10//4*scalar**2.25;// omni = 1shot anyone, common = 1/25 of your hp

        this.impulse = {
            x: 0,
            y: 0
        };

        this.dead = false;

        // nod to how afk flowers look
        this.angle = Math.random() * Math.PI * 2;
        this.magnitude = 0;

        this.maxSpeed = 120;
        if (rarity === 'boss') {
            this.maxSpeed *= 0.8;
            this.hp *= 12;
            this.maxHp *= 12;
            this.r *= 2.2;
            this.baseR *= 2.2;
            this.damage /= 1.5;

            this.hp *= 2.5**bossLevel;
            this.maxHp = this.hp;
            let radiusIncrease = 1.1**bossLevel;
            if (radiusIncrease > 2){
              radiusIncrease = 2;
            }
            this.r *= radiusIncrease;
            this.baseR *= radiusIncrease;

        }

        this.boostSpeed = 0;

        this.maxBoostTimer = 1800 + 400 / scalar;
        this.boostTimer = this.maxBoostTimer;

        this.dimensions = dimensions;

        this.cooldown = 0;
        this.special = 0;
    }
    simulate(dt, players, enemies, roomLocation) {
        // ok so the ai is very simple
        // basically what it does is detects the nearest player
        // if it notices:
        // it moves in a direction and tries to maintain a distance of the petals expanded
        // if player is closer then the petals also retract

        // else:
        // moves like an afk florr mob

        if (this.rarity === 'boss') {
            this.cooldown -= dt + this.bossLevel/2.5;
            let nearestId = null;
            if (this.cooldown < 0) {
                this.cooldown = 4200;
                if (this.special == 0) {
                    this.special = 1 + Math.floor(Math.random() * 2.5) // spawning is a 2x more rare
                    if(this.special === 3){
                        this.boostTimer = 0;
                    }
                } else {
                    this.special = 0;
                    this.boostSpeed = 0;
                    this.impulse.x = 0;
                    this.impulse.y = 0;
                    this.boostTimer = 0;
                }
            }

            if (this.special != 2) {
                this.r += (this.baseR - this.r) / 70;
            }

            if (this.special == 0) {
                // Normal
                let nearestDistance = 1200 * Math.sqrt(this.r / 23.5); // max distance
                for (let id in players) {
                    if (Math.hypot(players[id].x - this.x, players[id].y - this.y) < nearestDistance) {
                        nearestDistance = Math.hypot(players[id].x - this.x, players[id].y - this.y);
                        nearestId = id;
                    }
                }

                if (nearestId !== null) {
                    const distance = Math.hypot(players[nearestId].x - this.x, players[nearestId].y - this.y);
                    this.angle = Math.atan2(players[nearestId].y - this.y, players[nearestId].x - this.x);
                    // gentle acceleration
                    this.magnitude = Math.min(this.maxSpeed, this.magnitude + 80);

                    // boosting
                    this.boostTimer -= dt;
                    if (this.boostTimer <= 0) {
                        this.boostTimer = this.maxBoostTimer;
                        this.boostSpeed += 2800;
                    }
                    // enemies not defined because its literally not passed into the function
                } else {
                    this.magnitude *= 0.9;
                }

                const xv = Math.cos(this.angle) * (this.magnitude + this.boostSpeed) * playerSpeed + this.impulse.x;
                const yv = Math.sin(this.angle) * (this.magnitude + this.boostSpeed) * playerSpeed + this.impulse.y;

                this.x += xv * dt / 1000;
                this.y += yv * dt / 1000;

                this.impulse.x *= Math.pow( /*this.friction*/ 0.8, dt * 15);
                this.impulse.y *= Math.pow( /*this.friction*/ 0.8, dt * 15);

                this.boostSpeed *= Math.pow( /*this.friction*/ 0.7, dt * 15);
            } else if (this.special == 1) {
                //Chase
                let nearestDistance = 1200 * Math.sqrt(this.r / 23.5); // max distance
                for (let id in players) {
                    if (Math.hypot(players[id].x - this.x, players[id].y - this.y) < nearestDistance) {
                        nearestDistance = Math.hypot(players[id].x - this.x, players[id].y - this.y);
                        nearestId = id;
                    }
                }

                if (nearestId !== null) {
                    const distance = Math.hypot(players[nearestId].x - this.x, players[nearestId].y - this.y);
                    this.angle = Math.atan2(players[nearestId].y - this.y, players[nearestId].x - this.x);
                    this.magnitude = 0;
                    this.boostSpeed = 315 + this.bossLevel*2.5;
                    // boosting
                    // enemies not defined because its literally not passed into the function
                } else {
                    this.magnitude *= 0.9;
                }

                const xv = Math.cos(this.angle) * (this.magnitude + this.boostSpeed) * playerSpeed;
                const yv = Math.sin(this.angle) * (this.magnitude + this.boostSpeed) * playerSpeed;

                this.x += xv * dt / 1000;
                this.y += yv * dt / 1000;
            } else if (this.special == 2) {
                //Boost
                this.r += (90 - this.r) / 5;
                // mice have good sense of smell
                let nearestDistance = 22000 * Math.sqrt(this.r / 23.5); // max distance
                for (let id in players) {
                    if (Math.hypot(players[id].x - this.x, players[id].y - this.y) < nearestDistance) {
                        nearestDistance = Math.hypot(players[id].x - this.x, players[id].y - this.y);
                        nearestId = id;
                    }
                }

                if (nearestDistance > 650 * 10 / (this.bossLevel+10)) {
                    this.boostSpeed = 0;
                    this.boostTimer = 0;
                }

                if (nearestId !== null) {
                    const distance = Math.hypot(players[nearestId].x - this.x, players[nearestId].y - this.y);

                    // gentle acceleration
                    this.magnitude = Math.min(this.maxSpeed, this.magnitude + 80);

                    // boosting
                    this.boostTimer -= dt;
                    if (this.boostTimer <= 0) {
                        this.boostTimer = 1500;
                        this.boostSpeed = 1120+12*this.bossLevel;
                        this.angle = Math.atan2(players[nearestId].y - this.y, players[nearestId].x - this.x);
                    }
                    // enemies not defined because its literally not passed into the function
                }

                const xv = Math.cos(this.angle) * (this.boostSpeed) * playerSpeed + this.impulse.x;
                const yv = Math.sin(this.angle) * (this.boostSpeed) * playerSpeed + this.impulse.y;

                this.x += xv * dt / 1000;
                this.y += yv * dt / 1000;

                this.impulse.x *= Math.pow( /*this.friction*/ 0.7, dt * 15);
                this.impulse.y *= Math.pow( /*this.friction*/ 0.7, dt * 15);
            } else if (this.special == 3) {
                // spawn more mouse
                // special attack is 3s instaed of 6s so subtract dt again
                this.cooldown -= dt;

                let nearestDistance = 1200 * Math.sqrt(this.r / 23.5); // max distance
                for (let id in players) {
                    if (Math.hypot(players[id].x - this.x, players[id].y - this.y) < nearestDistance) {
                        nearestDistance = Math.hypot(players[id].x - this.x, players[id].y - this.y);
                        nearestId = id;
                    }
                }

                this.angle += 0.25;
                if (nearestId !== null) {
                    const distance = Math.hypot(players[nearestId].x - this.x, players[nearestId].y - this.y);

                    // gentle acceleration
                    this.magnitude = Math.min(this.maxSpeed, this.magnitude + 80);

                    // boosting
                    this.boostTimer -= dt;
                    if (this.boostTimer <= 0 && this.cooldown < 4200) {
                        this.boostTimer = 150 * 5 / (this.bossLevel+5);
                        let spawn;
                        let rand = Math.random();
                        if (rand < 0.03) {
                            spawn = new MopeMouse('omnipotent', this.dimensions);
                        } else if (rand < 0.14) {
                            spawn = new MopeMouse('legendary', this.dimensions);
                        } else if (rand < 0.31) {
                            spawn = new MopeMouse('epic', this.dimensions);
                        } else if (rand < 0.59) {
                            spawn = new MopeMouse('rare', this.dimensions);
                        } else if (rand < 0.87) {
                            spawn = new MopeMouse('unusual', this.dimensions);
                        } else {
                            spawn = new MopeMouse('common', this.dimensions);
                        }
                        const spawnAngle = this.angle;
                        spawn.x = this.x + Math.cos(spawnAngle) * ( /*spawn.r +*/ this.r);
                        spawn.y = this.y + Math.sin(spawnAngle) * ( /*spawn.r +*/ this.r);
                        spawn.hp *= 1.5**this.bossLevel;
                        spawn.maxHp *= 1.5**this.bossLevel;
                        enemies.push(spawn);
                        broadcastInRoom(roomLocation, {
                            newEnemy: spawn.initPack()
                        });
                    }
                    // enemies not defined because its literally not passed into the function
                } else {
                    this.magnitude *= 0.9;
                }

                const xv = Math.cos(this.angle) * (this.magnitude + this.boostSpeed) * playerSpeed + this.impulse.x;
                const yv = Math.sin(this.angle) * (this.magnitude + this.boostSpeed) * playerSpeed + this.impulse.y;


                this.impulse.x *= Math.pow( /*this.friction*/ 0.8, dt * 15);
                this.impulse.y *= Math.pow( /*this.friction*/ 0.8, dt * 15);

                this.boostSpeed *= Math.pow( /*this.friction*/ 0.7, dt * 15);
            }
        } else {
            //NOT A BOSS

            let nearestId = null;

            // mice have good sense of smell
            let nearestDistance = 1200 * Math.sqrt(this.r / 23.5); // max distance
            for (let id in players) {
                if (Math.hypot(players[id].x - this.x, players[id].y - this.y) < nearestDistance) {
                    nearestDistance = Math.hypot(players[id].x - this.x, players[id].y - this.y);
                    nearestId = id;
                }
            }

            if (nearestId !== null) {
                const distance = Math.hypot(players[nearestId].x - this.x, players[nearestId].y - this.y);
                this.angle = Math.atan2(players[nearestId].y - this.y, players[nearestId].x - this.x);
                // gentle acceleration
                this.magnitude = Math.min(this.maxSpeed, this.magnitude + 80);

                // boosting
                this.boostTimer -= dt;
                if (this.boostTimer <= 0) {
                    this.boostTimer = this.maxBoostTimer;
                    this.boostSpeed += 1400;
                }
                // enemies not defined because its literally not passed into the function
            } else {
                this.magnitude *= 0.9;
            }

            const xv = Math.cos(this.angle) * (this.magnitude + this.boostSpeed) * playerSpeed + this.impulse.x;
            const yv = Math.sin(this.angle) * (this.magnitude + this.boostSpeed) * playerSpeed + this.impulse.y;

            this.x += xv * dt / 1000;
            this.y += yv * dt / 1000;

            this.impulse.x *= Math.pow( /*this.friction*/ 0.8, dt * 15);
            this.impulse.y *= Math.pow( /*this.friction*/ 0.8, dt * 15);

            this.boostSpeed *= Math.pow( /*this.friction*/ 0.7, dt * 15);
        }
    }
    initPack() {
        return this;
    }
    updatePack() {
        if (this.dead === true) {
            return {
                dead: true,
            }
        } else {
            return {
                x: this.x,
                y: this.y,
                hp: this.hp,
                angle: this.angle,
                magnitude: this.magnitude,
                r: this.r
            };
        }
    }
    drop(dimensions) {
        const drops = [];
        if (this.rarity == "boss"){
          drops.push(new BubblePetalSlot(this));
          if (this.bossLevel >= 4){
            drops.push(new BubblePetalSlot(this));
            drops.push(new BubblePetalSlot({...this, rarity: "supreme"}));
          }
        }
         else{
        // on death, spawn these kinds of petals
        if (Math.random() < 0.4) {
            drops.push(new BubblePetalSlot({
                ...this,
                rarity: this.rarity
            }));
        }

        if (Math.random() < 0.44 && rarityToScalar[this.rarity] - 1 > 0) {
            drops.push(new BubblePetalSlot({
                ...this,
                rarity: scalarToRarity[rarityToScalar[this.rarity] - 1]
            }));
        }
         }

        if (drops.length > 1) {
            // change the petals to a circle so that they dont overlap
            const angleIncrement = Math.PI * 2 / drops.length;
            const distance = 50;
            for (let i = 0; i < drops.length; i++) {
                const angle = i * angleIncrement;

                drops[i].intialX = drops[i].x;
                drops[i].initialY = drops[i].y;

                drops[i].x += Math.cos(angle) * distance;
                drops[i].y += Math.sin(angle) * distance;
            }
        }

        for (let i = 0; i < drops.length; i++) {
            drops[i].boundWalls(dimensions);
        }

        return drops;
    }
}

class PeaEnemy {
    constructor(rarity, dimensions, bossLevel) {
        this.bossLevel = bossLevel ?? 0;
        const scalar = rarityToScalar[rarity];
        this.r = 12 + 4 * (scalar ** 2); //(6*(scalar**2.25)-4)*(0.8+Math.random()*0.4)*1.25;
        this.baseR = this.r;
        this.rarity = rarity;
        this.x = Math.random() * (dimensions.x - this.r * 2) + this.r;
        this.y = Math.random() * (dimensions.y - this.r * 2) + this.r;
        this.type = 'peaenemy';

        // common 60 - omni 10k
        // this.hp = ((this.r+2)**(1.65)/4)**1.5/2+16;

        // haha's ver
        // this.hp = 6 + 5 * (3 ** scalar); //enemyStats[this.type][this.rarity].hp;
        // this.damage = 4 + 1.5 * (1.15 ** scalar)

        this.hp = 20+20*(1.8**scalar);//enemyStats[this.type][this.rarity].hp;
        this.damage = 2+1*(1.3**scalar)

        this.maxHp = this.hp;

        // this.damage = 10//4*scalar**2.25;// omni = 1shot anyone, common = 1/25 of your hp

        this.impulse = {
            x: 0,
            y: 0
        };

        this.dead = false;

        // nod to how afk flowers look
        this.angle = Math.random() * Math.PI * 2;
        this.magnitude = 0;

        this.maxSpeed = 120;
        if (rarity === 'boss') {
            this.maxSpeed *= 0.8;
            this.hp *= 12;
            this.maxHp *= 12;
            this.r *= 2.2;
            this.baseR *= 2.2;
            this.damage /= 1.5;

            this.hp *= 2.5**bossLevel;
            this.maxHp = this.hp;
            let radiusIncrease = 1.1**bossLevel;
            if (radiusIncrease > 2){
              radiusIncrease = 2;
            }
            this.r *= radiusIncrease;
            this.baseR *= radiusIncrease;

        }

        this.boostSpeed = 0;

        this.maxBoostTimer = 1800 + 400 / scalar;
        this.boostTimer = this.maxBoostTimer;

        this.dimensions = dimensions;

        this.cooldown = 0;
        this.special = 0;
    }
    simulate(dt, players, enemies, roomLocation) {
        // ok so the ai is very simple
        // basically what it does is detects the nearest player
        // if it notices:
        // it moves in a direction and tries to maintain a distance of the petals expanded
        // if player is closer then the petals also retract

        // else:
        // moves like an afk florr mob

        if (this.rarity === 'boss') {
            this.cooldown -= dt + this.bossLevel/2.5;
            let nearestId = null;
            if (this.cooldown < 0) {
                this.cooldown = 4200;
                if (this.special == 0) {
                    this.special = 1 + Math.floor(Math.random() * 2.5) // spawning is a 2x more rare
                    if(this.special === 3){
                        this.boostTimer = 0;
                    }
                } else {
                    this.special = 0;
                    this.boostSpeed = 0;
                    this.impulse.x = 0;
                    this.impulse.y = 0;
                    this.boostTimer = 0;
                }
            }

            if (this.special != 2) {
                this.r += (this.baseR - this.r) / 70;
            }

            if (this.special == 0) {
                // Normal
                let nearestDistance = 1200 * Math.sqrt(this.r / 23.5); // max distance
                for (let id in players) {
                    if (Math.hypot(players[id].x - this.x, players[id].y - this.y) < nearestDistance) {
                        nearestDistance = Math.hypot(players[id].x - this.x, players[id].y - this.y);
                        nearestId = id;
                    }
                }

                if (nearestId !== null) {
                    const distance = Math.hypot(players[nearestId].x - this.x, players[nearestId].y - this.y);
                    this.angle = Math.atan2(players[nearestId].y - this.y, players[nearestId].x - this.x);
                    // gentle acceleration
                    this.magnitude = Math.min(this.maxSpeed, this.magnitude + 80);

                    // boosting
                    this.boostTimer -= dt;
                    if (this.boostTimer <= 0) {
                        this.boostTimer = this.maxBoostTimer;
                        this.boostSpeed += 2800;
                    }
                    // enemies not defined because its literally not passed into the function
                } else {
                    this.magnitude *= 0.9;
                }

                const xv = Math.cos(this.angle) * (this.magnitude + this.boostSpeed) * playerSpeed + this.impulse.x;
                const yv = Math.sin(this.angle) * (this.magnitude + this.boostSpeed) * playerSpeed + this.impulse.y;

                this.x += xv * dt / 1000;
                this.y += yv * dt / 1000;

                this.impulse.x *= Math.pow( /*this.friction*/ 0.8, dt * 15);
                this.impulse.y *= Math.pow( /*this.friction*/ 0.8, dt * 15);

                this.boostSpeed *= Math.pow( /*this.friction*/ 0.7, dt * 15);
            } else if (this.special == 1) {
                //Chase
                let nearestDistance = 1200 * Math.sqrt(this.r / 23.5); // max distance
                for (let id in players) {
                    if (Math.hypot(players[id].x - this.x, players[id].y - this.y) < nearestDistance) {
                        nearestDistance = Math.hypot(players[id].x - this.x, players[id].y - this.y);
                        nearestId = id;
                    }
                }

                if (nearestId !== null) {
                    const distance = Math.hypot(players[nearestId].x - this.x, players[nearestId].y - this.y);
                    this.angle = Math.atan2(players[nearestId].y - this.y, players[nearestId].x - this.x);
                    this.magnitude = 0;
                    this.boostSpeed = 315 + this.bossLevel*2.5;
                    // boosting
                    // enemies not defined because its literally not passed into the function
                } else {
                    this.magnitude *= 0.9;
                }

                const xv = Math.cos(this.angle) * (this.magnitude + this.boostSpeed) * playerSpeed;
                const yv = Math.sin(this.angle) * (this.magnitude + this.boostSpeed) * playerSpeed;

                this.x += xv * dt / 1000;
                this.y += yv * dt / 1000;
            } else if (this.special == 2) {
                //Boost
                this.r += (90 - this.r) / 5;
                // mice have good sense of smell
                let nearestDistance = 22000 * Math.sqrt(this.r / 23.5); // max distance
                for (let id in players) {
                    if (Math.hypot(players[id].x - this.x, players[id].y - this.y) < nearestDistance) {
                        nearestDistance = Math.hypot(players[id].x - this.x, players[id].y - this.y);
                        nearestId = id;
                    }
                }

                if (nearestDistance > 650 * 10 / (this.bossLevel+10)) {
                    this.boostSpeed = 0;
                    this.boostTimer = 0;
                }

                if (nearestId !== null) {
                    const distance = Math.hypot(players[nearestId].x - this.x, players[nearestId].y - this.y);

                    // gentle acceleration
                    this.magnitude = Math.min(this.maxSpeed, this.magnitude + 80);

                    // boosting
                    this.boostTimer -= dt;
                    if (this.boostTimer <= 0) {
                        this.boostTimer = 1500;
                        this.boostSpeed = 1120+12*this.bossLevel;
                        this.angle = Math.atan2(players[nearestId].y - this.y, players[nearestId].x - this.x);
                    }
                    // enemies not defined because its literally not passed into the function
                }

                const xv = Math.cos(this.angle) * (this.boostSpeed) * playerSpeed + this.impulse.x;
                const yv = Math.sin(this.angle) * (this.boostSpeed) * playerSpeed + this.impulse.y;

                this.x += xv * dt / 1000;
                this.y += yv * dt / 1000;

                this.impulse.x *= Math.pow( /*this.friction*/ 0.7, dt * 15);
                this.impulse.y *= Math.pow( /*this.friction*/ 0.7, dt * 15);
            } else if (this.special == 3) {
                // spawn more mouse
                // special attack is 3s instaed of 6s so subtract dt again
                this.cooldown -= dt;

                let nearestDistance = 1200 * Math.sqrt(this.r / 23.5); // max distance
                for (let id in players) {
                    if (Math.hypot(players[id].x - this.x, players[id].y - this.y) < nearestDistance) {
                        nearestDistance = Math.hypot(players[id].x - this.x, players[id].y - this.y);
                        nearestId = id;
                    }
                }

                this.angle += 0.25;
                if (nearestId !== null) {
                    const distance = Math.hypot(players[nearestId].x - this.x, players[nearestId].y - this.y);

                    // gentle acceleration
                    this.magnitude = Math.min(this.maxSpeed, this.magnitude + 80);

                    // boosting
                    this.boostTimer -= dt;
                    if (this.boostTimer <= 0 && this.cooldown < 4200) {
                        this.boostTimer = 150 * 5 / (this.bossLevel+5);
                        let spawn;
                        let rand = Math.random();
                        if (rand < 0.03) {
                            spawn = new PeaEnemy('omnipotent', this.dimensions);
                        } else if (rand < 0.14) {
                            spawn = new PeaEnemy('legendary', this.dimensions);
                        } else if (rand < 0.31) {
                            spawn = new PeaEnemy('epic', this.dimensions);
                        } else if (rand < 0.59) {
                            spawn = new PeaEnemy('rare', this.dimensions);
                        } else if (rand < 0.87) {
                            spawn = new PeaEnemy('unusual', this.dimensions);
                        } else {
                            spawn = new PeaEnemy('common', this.dimensions);
                        }
                        const spawnAngle = this.angle;
                        spawn.x = this.x + Math.cos(spawnAngle) * ( /*spawn.r +*/ this.r);
                        spawn.y = this.y + Math.sin(spawnAngle) * ( /*spawn.r +*/ this.r);
                        spawn.hp *= 1.5**this.bossLevel;
                        spawn.maxHp *= 1.5**this.bossLevel;
                        enemies.push(spawn);
                        broadcastInRoom(roomLocation, {
                            newEnemy: spawn.initPack()
                        });
                    }
                    // enemies not defined because its literally not passed into the function
                } else {
                    this.magnitude *= 0.9;
                }

                const xv = Math.cos(this.angle) * (this.magnitude + this.boostSpeed) * playerSpeed + this.impulse.x;
                const yv = Math.sin(this.angle) * (this.magnitude + this.boostSpeed) * playerSpeed + this.impulse.y;


                this.impulse.x *= Math.pow( /*this.friction*/ 0.8, dt * 15);
                this.impulse.y *= Math.pow( /*this.friction*/ 0.8, dt * 15);

                this.boostSpeed *= Math.pow( /*this.friction*/ 0.7, dt * 15);
            }
        } else {
            //NOT A BOSS

            let nearestId = null;

            // mice have good sense of smell
            let nearestDistance = 1200 * Math.sqrt(this.r / 23.5); // max distance
            for (let id in players) {
                if (Math.hypot(players[id].x - this.x, players[id].y - this.y) < nearestDistance) {
                    nearestDistance = Math.hypot(players[id].x - this.x, players[id].y - this.y);
                    nearestId = id;
                }
            }

            if (nearestId !== null) {
                const distance = Math.hypot(players[nearestId].x - this.x, players[nearestId].y - this.y);
                this.angle = Math.atan2(players[nearestId].y - this.y, players[nearestId].x - this.x);
                // gentle acceleration
                this.magnitude = Math.min(this.maxSpeed, this.magnitude + 80);

                // boosting
                this.boostTimer -= dt;
                if (this.boostTimer <= 0) {
                    this.boostTimer = this.maxBoostTimer;
                    this.boostSpeed += 1400;
                }
                // enemies not defined because its literally not passed into the function
            } else {
                this.magnitude *= 0.9;
            }

            const xv = Math.cos(this.angle) * (this.magnitude + this.boostSpeed) * playerSpeed + this.impulse.x;
            const yv = Math.sin(this.angle) * (this.magnitude + this.boostSpeed) * playerSpeed + this.impulse.y;

            this.x += xv * dt / 1000;
            this.y += yv * dt / 1000;

            this.impulse.x *= Math.pow( /*this.friction*/ 0.8, dt * 15);
            this.impulse.y *= Math.pow( /*this.friction*/ 0.8, dt * 15);

            this.boostSpeed *= Math.pow( /*this.friction*/ 0.7, dt * 15);
        }
    }
    initPack() {
        return this;
    }
    updatePack() {
        if (this.dead === true) {
            return {
                dead: true,
            }
        } else {
            return {
                x: this.x,
                y: this.y,
                hp: this.hp,
                angle: this.angle,
                magnitude: this.magnitude,
                r: this.r
            };
        }
    }
    drop(dimensions) {
        const drops = [];
        if (this.rarity == "boss"){
          drops.push(new PeaPetalSlot(this));
          if (this.bossLevel >= 4){
            drops.push(new PeaPetalSlot(this));
            drops.push(new PeaPetalSlot({...this, rarity: "supreme"}));
          }
        }
         else{
        // on death, spawn these kinds of petals
        if (Math.random() < 0.4) {
            drops.push(new PeaPetalSlot({
                ...this,
                rarity: this.rarity
            }));
        }

        if (Math.random() < 0.44 && rarityToScalar[this.rarity] - 1 > 0) {
            drops.push(new PeaPetalSlot({
                ...this,
                rarity: scalarToRarity[rarityToScalar[this.rarity] - 1]
            }));
        }
         }

        if (drops.length > 1) {
            // change the petals to a circle so that they dont overlap
            const angleIncrement = Math.PI * 2 / drops.length;
            const distance = 50;
            for (let i = 0; i < drops.length; i++) {
                const angle = i * angleIncrement;

                drops[i].intialX = drops[i].x;
                drops[i].initialY = drops[i].y;

                drops[i].x += Math.cos(angle) * distance;
                drops[i].y += Math.sin(angle) * distance;
            }
        }

        for (let i = 0; i < drops.length; i++) {
            drops[i].boundWalls(dimensions);
        }

        return drops;
    }
}

module.exports = {
    Rock,
    Portal,
    EvilFlower,
    Diep,
    MopeMouse,
    PeaEnemy,
    Cactus
};