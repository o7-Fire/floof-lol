const { Rock, EvilFlower, Diep, MopeMouse, PeaEnemy, Cactus } = require('./Enemy.js');

const pointsPerRarity = {
    common: 1,
    unusual: 3,
    rare: 6,
    epic: 25,
    legendary: 45,
    omnipotent: 185,
    boss: 500
};

const spawnTimePerRarity = {
    common: 0,
    unusual: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
    omnipotent: 0,
    boss: 0
}

//const spawnTimePerRarity = {
//    common: 1000,
//    unusual: 1100,
//    rare: 1200,
//    epic: 1800,
//    legendary: 3000,
//    omnipotent: 5000,
//    boss: 1000
//}

const enemyTypes = ['rock', 'evilflower', 'diep', 'mopemouse', "peaenemy", "cactus"];

module.exports = class Spawner {
    constructor(points, rarity, dimensions, roomLocation, forceEnemyType=null){
        this.enemyType = enemyTypes[Math.floor(Math.random()*enemyTypes.length)];
        if(forceEnemyType !== null){
            this.enemyType = forceEnemyType;
        }

        this.roomLocation = roomLocation;

        if(this.enemyType === 'evilflower'){
            this.points = points*6;
        } else if(this.enemyType === 'rock'){
            this.points = points*10;
        } else if(this.enemyType === 'cactus'){
            this.points = points*10;
        } else if(this.enemyType === 'diep'){
            this.points = points*4;
        } else if(this.enemyType === 'mopemouse'){
            this.points = points*8;
        } else if(this.enemyType === "peaenemy"){
            this.points = points*20;
        } else {
            console.log('enemy spawner type is undefined server side! Spawner.js');
        }

        this.dimensions = dimensions;// {x,y}
        this.rarity = rarity;

        // {rarity: common, highestRarityPoints: 1}
        this.maxTimer = 100+spawnTimePerRarity[this.rarity]*(Math.random()+1/3);
        this.timer = this.maxTimer/2;

        this.finished = false;
        // console.log(`will spawn ${this.points/pointsPerRarity[this.rarity]} enemies at rarity ${this.rarity} or 1-2 tiers below`);
    }
    simulate(dt){
        this.timer -= dt;
        if(this.timer < 0){
            this.timer += this.maxTimer;
            this.points -= pointsPerRarity[this.rarity];

            if(this.points < 0){
                this.finished = true;
            }

            return this.spawn();
        }
    }
    spawn(){
        // spawner doesn't spawn portal
        switch(this.enemyType){
            case 'rock':
                return new Rock(this.rarity, this.dimensions);
                break;
            case 'evilflower':
                return new EvilFlower(this.rarity, this.dimensions, this.roomLocation);
                break;
            case 'diep':
                return new Diep(this.rarity, this.dimensions);
                break;
            case 'mopemouse':
                return new MopeMouse(this.rarity, this.dimensions);
                break;
            case "peaenemy":
                return new PeaEnemy(this.rarity, this.dimensions);
                break;
            case "cactus":
                return new Cactus(this.rarity, this.dimensions);
                break;
            default:
                console.log('defaulting on spawn! Spawner.js');
                return new Rock(this.rarity, this.dimensions);
                break;
        }
    }
}