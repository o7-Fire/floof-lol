const { BasicPetal, RockPetal, DiepPetal, BubblePetal, PeaPetal, CactusPetal } = require('./Petal.js');
const playerSpeed = 1;
const petalDistance = 75.0;
const maxHp = 100;

function generateUsername(num) {
    const prefix = '';
    const suffixLength = 6;
    const suffix = num.toString().padStart(suffixLength, '0');
    return `${prefix}${suffix}`;
  }
  
module.exports = class Player{
    constructor(id, init){
        this.id = id;
        this.x = init.x;
        this.y = init.y;
        this.r = 23.5;
        this.isPlayer = true; // how to regen hp simulation ?
        //generate UUID based on id
        this.playerId = generateUsername( Math.floor(Math.random() * 999999) );
        this.playerName = "";

        this.room = {x: init.room.x, y: init.room.y};

        // input
        this.angle = init.angle;
        this.magnitude = init.magnitude;

        this.maxHp = maxHp;
        this.hp = this.maxHp;
        this.lasthp = this.hp;
        this.tookdamagecount = 0;
        this.damage = 45;

        this.impulse = {x: 0, y: 0};

        this.petalDistance = petalDistance;
        this.desiredPetalDistance = petalDistance;

        if(init.petals){
            this.petals = init.petals;
        } else {
            this.petals = [];
            for(let i = 0; i < 10; i++){
                let rarity;
                let petal;
                if (Math.random() < 0.1) {
                    rarity = 'unusual';
                } else {
                    rarity = 'common';
                }
                if (Math.random() > 0.8) {
                    petal = new PeaPetal(rarity, Math.PI*2*i/10, this);
                } else if (Math.random() > 0.8) {
                    petal = new CactusPetal(rarity, Math.PI*2*i/10, this);
                } else if (Math.random() > 0.8) {
                    petal = new RockPetal(rarity, Math.PI*2*i/10, this);
                } else {
                    petal = new BasicPetal(rarity, Math.PI*2*i/10, this);
                }
                this.petals[i] = petal;
            }
        }
        //console.log(this.petals)
        // BasicPetal, RockPetal, TankPetal
        // const rarities = ['common','unusual','rare','epic','legendary','omnipotent'];
        // for(let i = 0; i < rarities.length; i++){
        //     console.log('RARITY ' + rarities[i]);
        //     console.log('BASIC: ' + JSON.stringify({hp: new BasicPetal(rarities[i], 0, this).hp, damage: new BasicPetal(rarities[i], 0, this).damage}));
        //     console.log('ROCK: ' + JSON.stringify({hp: new RockPetal(rarities[i], 0, this).hp, damage: new RockPetal(rarities[i], 0, this).damage}));
        // }

        this.attacking = init.attacking;
        this.defending = init.defending;
        this.updateAttackState();

        this.collectablePetals = [];// petal slots that are on the floor that can be collected by this player

        this.lastInputTimer = Date.now();
    }
    attack(data){
        this.attacking = data.attack ?? false;
        this.updateAttackState();
        this.lastInputTimer = Date.now();
    }
    defend(data){
        this.defending = data.defend ?? false;
        this.updateAttackState();
        this.lastInputTimer = Date.now();
    }
    updateAttackState(){
        if(this.attacking){
           this.desiredPetalDistance = petalDistance * 2.15;
        } else if(this.defending){
            this.desiredPetalDistance = petalDistance * 0.6;
        } else {
            this.desiredPetalDistance = petalDistance;
        }
    }
    simulate(dt, enemies){
        //console.log(this.hp, this.lasthp, this.tookdamagecount);
        let maxhpaftercactus = 100;
        for (const petal of this.petals) {
            if (petal.type === "cactuspetal") {
                maxhpaftercactus += petal.maxHp * 2;
            }
        }
        this.maxHp = maxhpaftercactus;
        if (this.tookdamagecount > 0) {
            this.tookdamagecount += 1;
        }
        if (this.tookdamagecount === 40) {
            this.tookdamagecount = 0;
        }
        if (this.hp < this.lasthp) {
            this.tookdamagecount = 1;
        }
        const xv = Math.cos(this.angle)*this.magnitude*playerSpeed+this.impulse.x;
        const yv = Math.sin(this.angle)*this.magnitude*playerSpeed+this.impulse.y;

        this.x += xv*dt/1000;
        this.y += yv*dt/1000;

        this.impulse.x *= Math.pow(/*this.friction*/0.8, dt * 15);
	    this.impulse.y *= Math.pow(/*this.friction*/0.8, dt * 15);

        this.petalDistance += (this.desiredPetalDistance - this.petalDistance) - (this.desiredPetalDistance - this.petalDistance) * Math.pow(0.985, dt);
        //regenerate hp 
        if (this.tookdamagecount === 0) {
            this.hp = Math.min(this.hp + (this.maxHp / 100), this.maxHp);
        }
        for(let i = 0; i < this.petals.length; i++){
            this.petals[i].simulate(this, dt, enemies);
        }
        this.lasthp = this.hp;
    }
    initPack(){
        return this;
    }
    updatePack() {
        return {
            id: this.id,
            playerId: this.playerId,
            x: this.x,
            y: this.y,
            angle: this.angle,
            magnitude: this.magnitude,
            hp: this.hp,
            maxHp: this.maxHp,
            impulse: this.impulse,
            petalDistance: this.petalDistance,
            playerName: this.playerName,
            petals: this.petals.map(p => p.updatePack()),
        }
    }
}