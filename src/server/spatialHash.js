const hashDistance = 50;// memory vs efficiency tradeoff

class SpatialHash {
    constructor(){
        // positions: { x: {y: [entities at this hash] } }
        this.positions = {};
        this.hashId = 0;
    }
    addEntities(entities){
        this.positions = {};
        for(let i = 0; i < entities.length; i++){
            const entity = entities[i];
            entity.hashPositions = [];
            entity.hashId = i;
            this.hashId++;
            const topSpatial = {
                x: entity.top.x - (entity.top.x % hashDistance) - hashDistance,
                y: entity.top.y - (entity.top.y % hashDistance) - hashDistance
            }
            const bottomSpatial = {
                x: entity.bottom.x - (entity.bottom.x % hashDistance) + 2*hashDistance,
                y: entity.bottom.y - (entity.bottom.y % hashDistance) + 2*hashDistance
            }
            for(let x = topSpatial.x; x < bottomSpatial.x; x += hashDistance){
                if(this.positions[x] === undefined){
                    this.positions[x] = {};
                }
                for(let y = topSpatial.y; y < bottomSpatial.y; y += hashDistance){
                    if(this.positions[x][y] === undefined){
                        this.positions[x][y] = {};
                    }
                    entity.hashPositions.push({x, y});
                    this.positions[x][y][i] = entity;
                }
            }
        }
    }
    calculateHashPoints(entity){
        const positions = {};
        const topSpatial = {
            x: entity.top.x - (entity.top.x % hashDistance),
            y: entity.top.y - (entity.top.y % hashDistance)
        }
        const bottomSpatial = {
            x: entity.bottom.x - (entity.bottom.x % hashDistance) + 2*hashDistance,
            y: entity.bottom.y - (entity.bottom.y % hashDistance) + 2*hashDistance
        }
        for(let x = topSpatial.x; x < bottomSpatial.x; x += hashDistance){
            if(!positions[x]){
                positions[x] = {};
            }
            for(let y = topSpatial.y; y < bottomSpatial.y; y += hashDistance){
                positions[x][y] = true;
            }
        }
        return positions;
    }
    updateEntity(entity){
        // deleting all the current hash positions
        for(let point of entity.hashPositions){
            const { x,y,id } = point;
            delete this.positions[x][y][id];
        }
        this.addEntities([entity]);
    }
    getCollisions(/*player: */entity){
        const hashPoints = this.calculateHashPoints(entity);
        const collisions = {};
        for(let x in hashPoints){
            for(let y in hashPoints[x]){
                if(this.positions[x] === undefined || this.positions[x][y] === undefined) continue;
                const intersectingEntities = Object.values(this.positions[x][y]);
                for(let e of intersectingEntities){
                    if(collisions[e.hashId] === undefined){
                        collisions[e.hashId] = e;
                    }
                }
            }
        }
        return Object.values(collisions);
    }
}

export default SpatialHash;