const petalSlotRadius = 44.5;

let globalPetalId = 0;
function distributeGlobalPetalId(){
    globalPetalId++;
    if(globalPetalId > 99999){
        globalPetalId = 0;
    }
    return globalPetalId;
}

class CactusPetalSlot {
    constructor({x, y, rarity}) {
        this.x = x;
        this.y = y;

        this.initialX = x;
        this.initialY = y;

        this.r = petalSlotRadius;

        this.type = "cactuspetalslot";
        this.rarity = rarity;

        this.petalType = "cactuspetal";

        this.id = distributeGlobalPetalId();
    }
    boundWalls(dimensions){
        if(this.x + this.r > dimensions.x){
            this.x = dimensions.x - this.r;
        } else if(this.x - this.r < 0){
            this.x = this.r;
        }
        if(this.y + this.r > dimensions.y){
            this.y = dimensions.y - this.r;
        } else if(this.y - this.r < 0){
            this.y = this.r;
        }
    }
    initPack(){
        return this;
    }
}

class PeaPetalSlot {
    constructor({x, y, rarity}) {
        this.x = x;
        this.y = y;

        this.initialX = x;
        this.initialY = y;

        this.r = petalSlotRadius;

        this.type = "peapetalslot";
        this.rarity = rarity;

        this.petalType = "peapetal";

        this.id = distributeGlobalPetalId();
    }
    boundWalls(dimensions){
        if(this.x + this.r > dimensions.x){
            this.x = dimensions.x - this.r;
        } else if(this.x - this.r < 0){
            this.x = this.r;
        }
        if(this.y + this.r > dimensions.y){
            this.y = dimensions.y - this.r;
        } else if(this.y - this.r < 0){
            this.y = this.r;
        }
    }
    initPack(){
        return this;
    }
}

class BasicPetalSlot {
    constructor({x,y,rarity}){
        this.x = x;
        this.y = y;

        this.initialX = x;
        this.initialY = y;

        this.r = petalSlotRadius;

        this.type = 'basicpetalslot';
        this.rarity = rarity;

        this.petalType = 'basicpetal';

        this.id = distributeGlobalPetalId();
    }
    boundWalls(dimensions){
        if(this.x + this.r > dimensions.x){
            this.x = dimensions.x - this.r;
        } else if(this.x - this.r < 0){
            this.x = this.r;
        }
        if(this.y + this.r > dimensions.y){
            this.y = dimensions.y - this.r;
        } else if(this.y - this.r < 0){
            this.y = this.r;
        }
    }
    initPack(){
        return this;
    }
}

class RockPetalSlot {
    constructor({x,y,rarity}){
        this.x = x;
        this.y = y;

        this.initialX = x;
        this.initialY = y;

        this.r = petalSlotRadius;

        this.type = 'rockpetalslot';
        this.rarity = rarity;

        this.petalType = 'rockpetal';

        this.id = distributeGlobalPetalId();
    }
    boundWalls(dimensions){
        if(this.x + this.r > dimensions.x){
            this.x = dimensions.x - this.r;
        } else if(this.x - this.r < 0){
            this.x = this.r;
        }
        if(this.y + this.r > dimensions.y){
            this.y = dimensions.y - this.r;
        } else if(this.y - this.r < 0){
            this.y = this.r;
        }
    }
    initPack(){
        return this;
    }
}

class DiepPetalSlot {
    constructor({x,y,rarity}){
        this.x = x;
        this.y = y;

        this.initialX = x;
        this.initialY = y;

        this.r = petalSlotRadius;

        this.type = 'dieppetalslot';
        this.rarity = rarity;

        this.petalType = 'dieppetal';

        this.id = distributeGlobalPetalId();
    }
    boundWalls(dimensions){
        if(this.x + this.r > dimensions.x){
            this.x = dimensions.x - this.r;
        } else if(this.x - this.r < 0){
            this.x = this.r;
        }
        if(this.y + this.r > dimensions.y){
            this.y = dimensions.y - this.r;
        } else if(this.y - this.r < 0){
            this.y = this.r;
        }
    }
    initPack(){
        return this;
    }
}

class BubblePetalSlot {
    constructor({x,y,rarity}){
        this.x = x;
        this.y = y;

        this.initialX = x;
        this.initialY = y;

        this.r = petalSlotRadius;

        this.type = 'bubblepetalslot';
        this.rarity = rarity;

        this.petalType = 'bubblepetal';

        this.id = distributeGlobalPetalId();
    }
    boundWalls(dimensions){
        if(this.x + this.r > dimensions.x){
            this.x = dimensions.x - this.r;
        } else if(this.x - this.r < 0){
            this.x = this.r;
        }
        if(this.y + this.r > dimensions.y){
            this.y = dimensions.y - this.r;
        } else if(this.y - this.r < 0){
            this.y = this.r;
        }
    }
    initPack(){
        return this;
    }
}

module.exports = { BasicPetalSlot, RockPetalSlot, DiepPetalSlot, BubblePetalSlot, PeaPetalSlot, CactusPetalSlot };