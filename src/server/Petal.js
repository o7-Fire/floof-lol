const rotationSpeed = 0.0023;
const petalSpeed = 1;

const rarityToScalar = {
    common: 1,
    unusual: 2,
    rare: 3,
    epic: 4,
    legendary: 5,
    omnipotent: 6,
    boss: 7,
    supreme: 8
};

function interpolate(start, end, time) {
    return start * (1 - time) + end * time;
}

// const petalStats = {
//     rockpetal: {
//         common: {hp: 8, damage: 2},
//         unusual: {hp: 18, damage: 5},
//         rare: {hp: 32, damage: 12},
//         epic: {hp: 90, damage: 24},
//         legendary: {hp: 640, damage: 42},
//         omnipotent: {hp: 1200, damage: 80},
//     },
//     basicpetal: {
//         common: {hp: 5, damage: 5},
//         unusual: {hp: 12, damage: 12},
//         rare: {hp: 24, damage: 24},
//         epic: {hp: 80, damage: 24},
//         legendary: {hp: 200, damage: 20},
//         omnipotent: {hp: 800, damage: 80},
//     },
// }

class Petal {
    constructor(type, rarity, angle, parent, roomLocation){
        switch(type){
            case 'basicpetal':
                return new BasicPetal(rarity, angle, parent, roomLocation);
                break;
            case 'rockpetal':
                return new RockPetal(rarity, angle, parent, roomLocation);
                break;
            case 'dieppetal':
                return new DiepPetal(rarity, angle, parent, roomLocation);
                break;
            case 'bubblepetal':
                return new BubblePetal(rarity, angle, parent, roomLocation);
                break;
            case "peapetal":
                return new PeaPetal(rarity, angle, parent, roomLocation);
                break;
            case "cactuspetal":
                return new CactusPetal(rarity, angle, parent, roomLocation);
                break;
            case 'default':
                console.log('server sided petal type not defined Petal.js');
                break;
        }
    }
}

class CactusPetal {
    constructor(rarity, angle, parent){
        this.rarity = rarity;

        this.type = 'cactuspetal';
        this.angle = angle;

        const scalar = rarityToScalar[rarity];

        this.x = parent.x + Math.cos(angle)*parent.petalDistance;
        this.y = parent.y + Math.sin(angle)*parent.petalDistance;

        this.r = 8.67+(scalar**1.2)/8.8*3;

        this.impulse = {x: 0, y: 0};// unused

        // this.hp = ((9.67+((rarityToScalar[rarity]*5)**1.2)/3.8*3)/10)**(2.4)*3+8+rarityToScalar[rarity]*3;

        // this.damage = (((9.67+((rarityToScalar[rarity]*5)**1.2)/8.8*3)/6)**1.6*5/1.2+6)*0.9*2.2+rarityToScalar[rarity]*2;

        // this.hp = 20;
        // this.damage = this.hp;
        // this.hp = 8+(1.8**scalar);//petalStats[this.type][this.rarity].hp;
        // this.damage = 2+(2.5**scalar)//petalStats[this.type][this.rarity].damage;
        this.hp = 20+(3**scalar);//petalStats[this.type][this.rarity].hp;
        this.damage = 1+(1.3**scalar)//petalStats[this.type][this.rarity].damage;

        if (scalar > 6){ //its over omnipotent
          this.hp *= 5**(scalar-6)
          this.damage *= 1.3**(scalar-6)
          this.maxHp *= 5**(scalar-6);
        }

        this.maxHp = this.hp;
        this.maxRechargeTime = 1000+500/rarityToScalar[rarity];
        this.rechargeTime = this.maxRechargeTime;

        this.rotationSpeed = rotationSpeed;
        if(parent.type == "evilflower" && parent.rarity === 'boss'){
            this.isBossPetal = true;

            this.rotationSpeed /= 5.5;
        }
    }
    simulate(parent, dt){
        this.angle += this.rotationSpeed*dt;
        if(this.angle > Math.PI*2){
            this.angle -= Math.PI*2;
        }

        // set our position to the flower's minus their velocity to give the illusion of being behind them
        const targetPosition = {
            x: parent.x + Math.cos(this.angle)*parent.petalDistance,
            y: parent.y + Math.sin(this.angle)*parent.petalDistance
        };

        this.x = targetPosition.x - Math.cos(parent.angle)*parent.magnitude*dt/200;
        this.y = targetPosition.y - Math.sin(parent.angle)*parent.magnitude*dt/200;

        if(this.hp < 0){
            this.rechargeTime -= dt;
            if(this.rechargeTime < 0){
                this.rechargeTime = this.maxRechargeTime;
                this.hp = this.maxHp;
            }
        }
    }
    initPack(){
        return this;
    }
    updatePack(){
        return {
            angle: this.angle,
            x: this.x,
            y: this.y,
            hp: this.hp
        }
    }
}

class PeaPetal {
    constructor(rarity, angle, parent){
        this.rarity = rarity;

        this.type = 'peapetal';
        this.angle = angle;

        const scalar = rarityToScalar[rarity];

        this.x = parent.x + Math.cos(angle)*parent.petalDistance;
        this.y = parent.y + Math.sin(angle)*parent.petalDistance;

        this.r = 8.67+(scalar**1.2)/8.8*3;

        this.impulse = {x: 0, y: 0};// unused

        // this.hp = ((9.67+((rarityToScalar[rarity]*5)**1.2)/3.8*3)/10)**(2.4)*3+8+rarityToScalar[rarity]*3;

        // this.damage = (((9.67+((rarityToScalar[rarity]*5)**1.2)/8.8*3)/6)**1.6*5/1.2+6)*0.9*2.2+rarityToScalar[rarity]*2;

        // this.hp = 20;
        // this.damage = this.hp;
        // this.hp = 8+(1.8**scalar);//petalStats[this.type][this.rarity].hp;
        // this.damage = 2+(2.5**scalar)//petalStats[this.type][this.rarity].damage;
        this.hp = 4+(1.3**scalar);//petalStats[this.type][this.rarity].hp;
        this.damage = 1.5+(1.3**scalar)//petalStats[this.type][this.rarity].damage;

        if (scalar > 6){ //its over omnipotent
          this.hp *= 2**(scalar-6)
          this.damage *= 2**(scalar-6)
          this.maxHp *= 2**(scalar-6);
        }

        this.maxHp = this.hp;
        this.maxRechargeTime = 200+300/rarityToScalar[rarity];
        this.rechargeTime = this.maxRechargeTime;

        this.rotationSpeed = rotationSpeed;
        if(parent.type == "evilflower" && parent.rarity === 'boss'){
            this.isBossPetal = true;

            this.rotationSpeed /= 5.5;
        }
    }
    simulate(parent, dt){
        this.angle += this.rotationSpeed*dt;
        if(this.angle > Math.PI*2){
            this.angle -= Math.PI*2;
        }

        // set our position to the flower's minus their velocity to give the illusion of being behind them
        const targetPosition = {
            x: parent.x + Math.cos(this.angle)*parent.petalDistance,
            y: parent.y + Math.sin(this.angle)*parent.petalDistance
        };

        this.x = targetPosition.x - Math.cos(parent.angle)*parent.magnitude*dt/200;
        this.y = targetPosition.y - Math.sin(parent.angle)*parent.magnitude*dt/200;

        if(this.hp < 0){
            this.rechargeTime -= dt;
            if(this.rechargeTime < 0){
                this.rechargeTime = this.maxRechargeTime;
                this.hp = this.maxHp;
            }
        }
    }
    initPack(){
        return this;
    }
    updatePack(){
        return {
            angle: this.angle,
            x: this.x,
            y: this.y,
            hp: this.hp
        }
    }
}

class BasicPetal {
    constructor(rarity, angle, parent){
        this.rarity = rarity;

        this.type = 'basicpetal';
        this.angle = angle;

        const scalar = rarityToScalar[rarity];

        this.x = parent.x + Math.cos(angle)*parent.petalDistance;
        this.y = parent.y + Math.sin(angle)*parent.petalDistance;

        this.r = 8.67+(scalar**1.2)/8.8*3;

        this.impulse = {x: 0, y: 0};// unused

        // this.hp = ((9.67+((rarityToScalar[rarity]*5)**1.2)/3.8*3)/10)**(2.4)*3+8+rarityToScalar[rarity]*3;

        // this.damage = (((9.67+((rarityToScalar[rarity]*5)**1.2)/8.8*3)/6)**1.6*5/1.2+6)*0.9*2.2+rarityToScalar[rarity]*2;

        // this.hp = 20;
        // this.damage = this.hp;
        // this.hp = 8+(1.8**scalar);//petalStats[this.type][this.rarity].hp;
        // this.damage = 2+(2.5**scalar)//petalStats[this.type][this.rarity].damage;
        this.hp = 8+(1.5**scalar);//petalStats[this.type][this.rarity].hp;
        this.damage = 2+(1.5**scalar)//petalStats[this.type][this.rarity].damage;

        if (scalar > 6){ //its over omnipotent
          this.hp *= 3.5**(scalar-6)
          this.damage *= 3.5**(scalar-6)
          this.maxHp *= 3.5**(scalar-6);
        }

        this.maxHp = this.hp;
        this.maxRechargeTime = 400+600/rarityToScalar[rarity];
        this.rechargeTime = this.maxRechargeTime;

        this.rotationSpeed = rotationSpeed;
        if(parent.type == "evilflower" && parent.rarity === 'boss'){
            this.isBossPetal = true;

            this.rotationSpeed /= 5.5;
        }
    }
    simulate(parent, dt){
        this.angle += this.rotationSpeed*dt;
        if(this.angle > Math.PI*2){
            this.angle -= Math.PI*2;
        }

        // set our position to the flower's minus their velocity to give the illusion of being behind them
        const targetPosition = {
            x: parent.x + Math.cos(this.angle)*parent.petalDistance,
            y: parent.y + Math.sin(this.angle)*parent.petalDistance
        };

        this.x = targetPosition.x - Math.cos(parent.angle)*parent.magnitude*dt/200;
        this.y = targetPosition.y - Math.sin(parent.angle)*parent.magnitude*dt/200;

        if(this.hp < 0){
            this.rechargeTime -= dt;
            if(this.rechargeTime < 0){
                this.rechargeTime = this.maxRechargeTime;
                this.hp = this.maxHp;
            }
        }
    }
    initPack(){
        return this;
    }
    updatePack(){
        return {
            angle: this.angle,
            x: this.x,
            y: this.y,
            hp: this.hp
        }
    }
}

class RockPetal {
    constructor(rarity, angle, parent){
        this.rarity = rarity;

        this.type = 'rockpetal';
        this.angle = angle;

        this.x = parent.x + Math.cos(angle)*parent.petalDistance;
        this.y = parent.y + Math.sin(angle)*parent.petalDistance;

        const scalar = rarityToScalar[rarity];

        this.r = 8.87+((scalar**1.2)/8.8*3)**1.2;

        this.impulse = {x: 0, y: 0};// unused

        // this.hp = ((9.67+((rarityToScalar[rarity]*5)**1.18)/3.2*3)/10)**(2.4)*4.8+8+rarityToScalar[rarity]*5;
        // this.damage = ((((9.67+((rarityToScalar[rarity]*5)**1.2)/8.8*3)/6)**1.6*5/3)+8)*1.1*1.8+rarityToScalar[rarity];
        // this.hp = petalStats[this.type][this.rarity].hp;
        // this.damage = petalStats[this.type][this.rarity].damage;

        // this.hp = 12+1.2*(1.6**scalar);//petalStats[this.type][this.rarity].hp;
        // this.damage = 2+1.2*(2.3**scalar)//petalStats[this.type][this.rarity].damage;
        this.hp = 12+1.2*(1.32**scalar);//petalStats[this.type][this.rarity].hp;
        this.damage = 2+1.2*(1.32**scalar)//petalStats[this.type][this.rarity].damage;

        if (scalar > 6){ //its over omnipotent
          this.hp *= 3.5**(scalar-6)
          this.damage *= 3.5**(scalar-6)
          this.maxHp *= 3.5**(scalar-6);
        }

        this.maxHp = this.hp;
        this.maxRechargeTime = 2200+1200/rarityToScalar[rarity];
        this.rechargeTime = this.maxRechargeTime;

        this.rotationSpeed = rotationSpeed;
        if(parent.type == "evilflower" && parent.rarity === 'boss'){
            this.isBossPetal = true;

            this.rotationSpeed /= 5.5;
        }
    }
    simulate(parent, dt){
        this.angle += this.rotationSpeed*dt;
        if(this.angle > Math.PI*2){
            this.angle -= Math.PI*2;
        }

        // set our position to the flower's minus their velocity to give the illusion of being behind them
        const targetPosition = {
            x: parent.x + Math.cos(this.angle)*parent.petalDistance,
            y: parent.y + Math.sin(this.angle)*parent.petalDistance
        };

        this.x = targetPosition.x - Math.cos(parent.angle)*parent.magnitude/12;
        this.y = targetPosition.y - Math.sin(parent.angle)*parent.magnitude/12;

        if(this.hp < 0){
            this.rechargeTime -= dt;
            if(this.rechargeTime < 0){
                this.rechargeTime = this.maxRechargeTime;
                this.hp = this.maxHp;
            }
        }
    }
    initPack(){
        return this;
    }
    updatePack(){
        return {
            angle: this.angle,
            x: this.x,
            y: this.y,
            hp: this.hp
        }
    }
}

class DiepPetal {
    constructor(rarity, angle, parent, roomLocation){
        this.rarity = rarity;

        this.type = 'dieppetal';
        this.angle = angle;

        const scalar = rarityToScalar[rarity];

        this.x = parent.x + Math.cos(angle)*parent.petalDistance;
        this.y = parent.y + Math.sin(angle)*parent.petalDistance;

        this.r = 8.67+(scalar**1.2)/8.8*3;

        this.impulse = {x: 0, y: 0};// unused

        // this.hp = ((9.67+((rarityToScalar[rarity]*5)**1.2)/3.8*3)/10)**(2.4)*3+8+rarityToScalar[rarity]*3;

        // this.damage = (((9.67+((rarityToScalar[rarity]*5)**1.2)/8.8*3)/6)**1.6*5/1.2+6)*0.9*2.2+rarityToScalar[rarity]*2;

        // this.hp = 20;
        // this.damage = this.hp;
        this.hp = 8+(1.1**scalar);//petalStats[this.type][this.rarity].hp;
        this.damage = 1//2+(1.5**scalar)//petalStats[this.type][this.rarity].damage;

        if (scalar > 6){ //its over omnipotent
          this.hp *= 3.5**(scalar-6)
          this.maxHp *= 3.5**(scalar-6);
          this.damage *= 3.5**(scalar-6)
        }
        this.maxHp = this.hp;
        this.maxRechargeTime = 400+600/rarityToScalar[rarity];
        this.rechargeTime = this.maxRechargeTime;

        this.shootAngle = Math.random()*Math.PI*2;

        this.bullets = {/*id: {x, y, direction}*/};

        this.bulletSpeed = scalar/12;
        this.bulletLife = 3000;

        this.maxCooldown = 600 + 1400/scalar;
        if (scalar > 6){
          this.maxCooldown = 300;
        }
        this.cooldown = this.maxCooldown * 0.8;


        // this.dimensions = dimensions;

        this.detectionDistance = 170 + scalar * 40;

        this.bulletRadius = this.r * 7 / 15;

        this.roomLocation = roomLocation;

        // to optimize sending state
        this.bulletsToRemove = [];
        this.bulletsToAdd = [];

        this.bulletDamage = 2+1.8**rarityToScalar[this.rarity]/4;
        if (scalar > 6){
          this.bulletDamage = 2 + 1.5 ** rarityToScalar[this.rarity]/4;
          this.bulletDamage *= 3 ** (scalar-6);
        }

        this.bulletHp = 2+1.8**rarityToScalar[this.rarity]/15;

        this.rotationSpeed = rotationSpeed;

        if(parent.type == "evilflower" && parent.rarity === 'boss'){
            this.isBossPetal = true;

            this.rotationSpeed /= 5.5;
            this.r = 8.67+(scalar**1.2)/8.8*3;
            this.hp = 8+(1.1**scalar);//petalStats[this.type][this.rarity].hp;
            this.damage = 1//2+(1.5**scalar)//petalStats[this.type][this.rarity].damage;

            this.maxHp = this.hp;
            this.maxRechargeTime = 400+600/rarityToScalar[rarity];
            this.rechargeTime = this.maxRechargeTime;

            this.shootAngle = Math.random()*Math.PI*2;

            this.bullets = {/*id: {x, y, direction}*/};

            this.bulletSpeed = scalar/12;
            this.bulletLife = 3000;

            this.maxCooldown = 600 + 1400/scalar;
            this.cooldown = this.maxCooldown * 0.8;
            this.bulletRadius = this.r * 7 / 15;
        }
    }
    simulate(parent, dt, enemies){
        this.angle += this.rotationSpeed*dt;
        if(this.angle > Math.PI*2){
            this.angle -= Math.PI*2;
        }

        // set our position to the flower's minus their velocity to give the illusion of being behind them
        const targetPosition = {
            x: parent.x + Math.cos(this.angle)*parent.petalDistance,
            y: parent.y + Math.sin(this.angle)*parent.petalDistance
        };

        this.x = targetPosition.x - Math.cos(parent.angle)*parent.magnitude*dt/200;
        this.y = targetPosition.y - Math.sin(parent.angle)*parent.magnitude*dt/200;

        if(this.hp < 0){
            this.rechargeTime -= dt;
            if(this.rechargeTime < 0){
                this.rechargeTime = this.maxRechargeTime;
                this.hp = this.maxHp;
            }
        } else {
            // new simulation

            let nearestId = null;
            let nearestDistance = this.detectionDistance;// max distance
            for(let i = 0; i < enemies.length; i++){
                if(enemies[i].dead === true || enemies[i].type === 'portal')continue;
                if(Math.hypot(enemies[i].x-this.x, enemies[i].y-this.y) - enemies[i].r < nearestDistance){
                    nearestDistance = Math.hypot(enemies[i].x-this.x, enemies[i].y-this.y) - enemies[i].r;
                    nearestId = i;
                }
            }

            if(nearestId !== null){
                // to prevent shooting randomly at thin air
                this.cooldown -= dt;

                const distance = Math.hypot(enemies[nearestId].x-this.x, enemies[nearestId].y-this.y);
                this.shootAngle = Math.atan2(enemies[nearestId].y-this.y, enemies[nearestId].x-this.x);
                if(this.cooldown < 0){
                    this.cooldown = Math.max(this.cooldown + this.maxCooldown, this.maxCooldown * 0.8);

                    const bulletId = Math.random();
                    //this.damage = 8+scalar/2;
                    //this.hp = (1.8**scalar)/5;
                    this.bullets[bulletId] = {x: this.x, y: this.y, angle: this.shootAngle, life: this.bulletLife, hp: this.bulletHp, damage: this.bulletDamage, r: this.bulletRadius};
                    this.bulletsToAdd.push({...this.bullets[bulletId], id: bulletId});
                }
            } else {
                this.shootAngle += dt*Math.PI*0.0002;
            }
        }

        for(let i in this.bullets){
            this.bullets[i].life -= dt;
            this.bullets[i].x += Math.cos(this.bullets[i].angle) * this.bulletSpeed * dt;
            this.bullets[i].y += Math.sin(this.bullets[i].angle) * this.bulletSpeed * dt;

            if(this.bullets[i].life < 0 || this.bullets[i].hp < 0){
                this.bulletsToRemove.push(i);// bullet id to remove
                delete this.bullets[i];
            }
        }
    }
    initPack(){
        return this;
    }
    updatePack(){
        let bulletsToAddPack = [];
        let bulletsToRemovePack = [];

        // deep copying
        for(let i = 0; i < this.bulletsToAdd.length; i++){
            bulletsToAddPack[i] = this.bulletsToAdd[i];
        }

        for(let i = 0; i < this.bulletsToRemove.length; i++){
            bulletsToRemovePack[i] = this.bulletsToRemove[i];
        }

        const pack = {
            angle: this.angle,
            x: this.x,
            y: this.y,
            hp: this.hp,
            shootAngle: this.shootAngle,
            bulletsToRemove: bulletsToRemovePack,
            bulletsToAdd: bulletsToAddPack
        };

        this.bulletsToRemove = [];
        this.bulletsToAdd = [];

        return pack;
    }
}

class BubblePetal {
    constructor(rarity, angle, parent){
        this.rarity = rarity;

        this.type = 'bubblepetal';
        this.angle = angle;

        const scalar = rarityToScalar[rarity];

        this.x = parent.x + Math.cos(angle)*parent.petalDistance;
        this.y = parent.y + Math.sin(angle)*parent.petalDistance;

        this.r = 8.67+(scalar**1.25)/10*3;

        this.impulse = {x: 0, y: 0};// unused

        this.hp = 1;
        this.damage = 1;


        this.maxHp = this.hp;
        this.maxRechargeTime = 2200-100*rarityToScalar[rarity]*2;
        if (this.maxRechargeTime <= 1000){
          this.maxRechargeTime = 500;
        }
      if (scalar > 6){
        this.maxRechargeTime = 20;
      }
        this.rechargeTime = this.maxRechargeTime;

        this.rotationSpeed = rotationSpeed;

        if(parent.type == "evilflower" && parent.rarity === 'boss'){
            this.isBossPetal = true;

            this.rotationSpeed /= 5.5;
        }

        this.force = (100 + 10*this.r**2) * (1 + scalar / 8);
        if (scalar > 6){ //its over omnipotent
          this.force *= 1.5**(scalar-6)
          this.force /= 2.2;
        }


        // this.bubbleDamage = 2.5**scalar;
        this.bubbleDamage = this.hp = 8+(1.35**scalar)*0.72;
        if (scalar > 6){ //its over omnipotent
          this.bubbleDamage *= 3.5**(scalar-6)
          this.hp *= 3.5**(scalar-6)
          this.maxHp *= 3.5**(scalar-6);
          this.bubbleDamage *= 1.2;
        }

        this.lastRechargeTime = Date.now();
    }
    simulate(parent, dt, enemies){
        this.angle += this.rotationSpeed*dt;
        if(this.angle > Math.PI*2){
            this.angle -= Math.PI*2;
        }

        // set our position to the flower's minus their velocity to give the illusion of being behind them
        const targetPosition = {
            x: parent.x + Math.cos(this.angle)*Math.min(61.1,parent.petalDistance),
            y: parent.y + Math.sin(this.angle)*Math.min(61.1,parent.petalDistance)
        };

        this.x = targetPosition.x - Math.cos(parent.angle)*parent.magnitude*dt/200;
        this.y = targetPosition.y - Math.sin(parent.angle)*parent.magnitude*dt/200;

        if(this.hp < 0){
            this.rechargeTime -= dt;
            if(this.rechargeTime < 0){
                this.rechargeTime = this.maxRechargeTime;
                this.hp = this.maxHp;
                this.lastRechargeTime = Date.now();
            }
        }

        // bubble popping
        if(/*parent.desiredPetalDistance <= 61.1*0.8*/parent.defending === true && this.hp > 0 && Date.now() - this.lastRechargeTime > 200){
            // die
            this.hp = -1;

            // push parent and other enemies
            parent.impulse.x += Math.cos(this.angle+Math.PI)*this.force;
            parent.impulse.y += Math.sin(this.angle+Math.PI)*this.force;


            for(let i in enemies){
                if(enemies[i].dead === true || enemies[i].type === 'portal')continue;
                const distanceToEnemy = Math.sqrt((enemies[i].x-this.x)**2+(enemies[i].y-this.y)**2);
                if(distanceToEnemy < 200 + enemies[i].r){
                    const angleToEnemy = Math.atan2(enemies[i].y-this.y,enemies[i].x-this.x);
                    enemies[i].impulse.x += Math.cos(angleToEnemy)*this.force*(200-distanceToEnemy)/150;
                    enemies[i].impulse.y += Math.sin(angleToEnemy)*this.force*(200-distanceToEnemy)/150;
                    enemies[i].hp -= this.bubbleDamage;
                }
            }
        }
    }
    initPack(){
        return this;
    }
    updatePack(){
        return {
            angle: this.angle,
            x: this.x,
            y: this.y,
            hp: this.hp
        }
    }
}

module.exports = { Petal, BasicPetal, RockPetal, DiepPetal, BubblePetal, PeaPetal, CactusPetal };