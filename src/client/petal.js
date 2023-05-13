const rotationSpeed = 0.0023;
const petalSpeed = 1;

const petalDamageTime = 150/*ms*/;

class Petal {
    constructor(init){
        switch (init.type){
            case 'basicpetal':
                return new BasicPetal(init);
                break;
            case 'rockpetal':
                return new RockPetal(init);
                break;
            case 'dieppetal':
                return new DiepPetal(init);
                break;
            case 'bubblepetal':
                return new BubblePetal(init);
                break;
            case "peapetal":
                return new PeaPetal(init);
                break;
            case "cactuspetal":
                return new CactusPetal(init);
                break;
            default:
                console.log('petal type is not defined new petal petal.js');
                break;
        }
    }
}

class CactusPetal {
    constructor(init){
        this.rarity = init.rarity;

        this.type = 'cactuspetal';
        this.angle = init.angle;

        this.x = init.x;
        this.y = init.y;

        this.r = init.r;
        this.initialRadius = init.r;

        this.renderX = init.x;
        this.renderY = init.y;

        this.impulse = {x: 0, y: 0};// unused

        this.hp = init.hp;

        this.damage = init.damage;
        this.lastDamageTime = 0;
        this.lastHealTime = Date.now();
        this.lastDeadTime = Date.now();

        this.renderRadius = 0;

        this.renderPetalDistance = 0;

        this.petalSlotType = 'cactuspetalslot';

        this.rotationSpeed = init.rotationSpeed;

        this.desiredPetalDistance = 0;
    }
    simulate(parent, dt){
        this.angle += this.rotationSpeed*dt;
        if(this.angle > Math.PI*2){
            this.angle -= Math.PI*2;
        }

        // set our position to the flower's minus their velocity to give the illusion of being behind them
        const targetPosition = {
            x: parent.x + Math.cos(this.angle)*this.renderPetalDistance,
            y: parent.y + Math.sin(this.angle)*this.renderPetalDistance
        };

        this.x = targetPosition.x - Math.cos(parent.angle)*parent.magnitude*dt/120;
        this.y = targetPosition.y - Math.sin(parent.angle)*parent.magnitude*dt/120;

        this.desiredPetalDistance = this.renderPetalDistance + (parent.petalDistance - this.renderPetalDistance) - (parent.petalDistance - this.renderPetalDistance) * Math.pow(0.8, dt*12)//interpolate(this.renderPetalDistance, parent.petalDistance, 0.5);

        if(parent.type === 'evilflower'){
            if(parent.rarity === 'boss'){
                this.renderPetalDistance = interpolate(this.renderPetalDistance, this.desiredPetalDistance, 1/15);
            } else {
                this.renderPetalDistance = interpolate(this.renderPetalDistance, this.desiredPetalDistance, 1/10);
            }
            this.renderX = interpolate(this.renderX, this.x, .16);
            this.renderY = interpolate(this.renderY, this.y, .16);
        } else {
            this.renderPetalDistance = interpolate(this.renderPetalDistance, this.desiredPetalDistance, 0.6);
            this.renderX = interpolate(this.renderX, this.x, .22);
            this.renderY = interpolate(this.renderY, this.y, .22);
        }
    }
    updatePack(data){
        for(let key in data){
            if(key === 'hp' && data.hp !== this.hp){
                if(data.hp < this.hp){
                    this.lastDamageTime = Date.now();
                    if(data.hp < 0){
                        this.lastDeadTime = Date.now();
                    }
                } else {
                    this.lastHealTime = Date.now();
                    this.renderPetalDistance = 0;///= 3;// temp?
                    this.r = this.initialRadius;
                    this.renderRadius = this.r;
                }

                this.hp = data.hp;
            } else {
                this[key] = data[key];
            }
        }
    }
    render(damaged=false){
        if(this.hp < 0 && damaged === false){
            this.r = this.initialRadius * 1.5;
            if(this.renderRadius > this.r*0.99){
                return;
            }
            ctx.globalAlpha = 1-this.renderRadius/this.r;
        }

        this.renderRadius = interpolate(this.renderRadius, this.r, 0.1);

        ctx.lineWidth = 3;
        if(damaged){
            if(ctx.globalAlpha > 0.95){
                ctx.globalAlpha = 0;//0.6;
                ctx.fillStyle = '#32CD32';
                ctx.strokeStyle = '#228B22';
            } else {
                ctx.fillStyle = '#008000';
                ctx.strokeStyle = '#006400';
            }
            ctx.globalAlpha /= 1.5;
        } else {
            ctx.fillStyle = '#32CD32';
            ctx.strokeStyle = '#228B22';
        }

        ctx.translate(this.renderX, this.renderY);
        ctx.rotate(this.renderAngle-Math.PI/2);
        ctx.drawImage(cactusImg, -this.renderRadius*1.3, -this.renderRadius*1.3, this.renderRadius*2.6, this.renderRadius*2.6);
        ctx.rotate(-this.renderAngle+Math.PI/2);
        ctx.translate(-this.renderX, -this.renderY);

        if(!damaged && Date.now() - this.lastDamageTime < petalDamageTime){
            ctx.globalAlpha = 1 - (Date.now() - this.lastDamageTime) / petalDamageTime;
            this.render(true);
            ctx.globalAlpha = 1;
        }

        ctx.globalAlpha = 1;
    }
}

class PeaPetal {
    constructor(init){
        this.rarity = init.rarity;

        this.type = 'peapetal';
        this.angle = init.angle;

        this.x = init.x;
        this.y = init.y;

        this.r = init.r;
        this.initialRadius = init.r;

        this.renderX = init.x;
        this.renderY = init.y;

        this.impulse = {x: 0, y: 0};// unused

        this.hp = init.hp;

        this.damage = init.damage;
        this.lastDamageTime = 0;
        this.lastHealTime = Date.now();
        this.lastDeadTime = Date.now();

        this.renderRadius = 0;

        this.renderPetalDistance = 0;

        this.petalSlotType = 'peapetalslot';

        this.rotationSpeed = init.rotationSpeed;

        this.desiredPetalDistance = 0;
    }
    simulate(parent, dt){
        this.angle += this.rotationSpeed*dt;
        if(this.angle > Math.PI*2){
            this.angle -= Math.PI*2;
        }

        // set our position to the flower's minus their velocity to give the illusion of being behind them
        const targetPosition = {
            x: parent.x + Math.cos(this.angle)*this.renderPetalDistance,
            y: parent.y + Math.sin(this.angle)*this.renderPetalDistance
        };

        this.x = targetPosition.x - Math.cos(parent.angle)*parent.magnitude*dt/120;
        this.y = targetPosition.y - Math.sin(parent.angle)*parent.magnitude*dt/120;

        this.desiredPetalDistance = this.renderPetalDistance + (parent.petalDistance - this.renderPetalDistance) - (parent.petalDistance - this.renderPetalDistance) * Math.pow(0.8, dt*12)//interpolate(this.renderPetalDistance, parent.petalDistance, 0.5);

        if(parent.type === 'evilflower'){
            if(parent.rarity === 'boss'){
                this.renderPetalDistance = interpolate(this.renderPetalDistance, this.desiredPetalDistance, 1/15);
            } else {
                this.renderPetalDistance = interpolate(this.renderPetalDistance, this.desiredPetalDistance, 1/10);
            }
            this.renderX = interpolate(this.renderX, this.x, .16);
            this.renderY = interpolate(this.renderY, this.y, .16);
        } else {
            this.renderPetalDistance = interpolate(this.renderPetalDistance, this.desiredPetalDistance, 0.6);
            this.renderX = interpolate(this.renderX, this.x, .22);
            this.renderY = interpolate(this.renderY, this.y, .22);
        }
    }
    updatePack(data){
        for(let key in data){
            if(key === 'hp' && data.hp !== this.hp){
                if(data.hp < this.hp){
                    this.lastDamageTime = Date.now();
                    if(data.hp < 0){
                        this.lastDeadTime = Date.now();
                    }
                } else {
                    this.lastHealTime = Date.now();
                    this.renderPetalDistance = 0;///= 3;// temp?
                    this.r = this.initialRadius;
                    this.renderRadius = this.r;
                }

                this.hp = data.hp;
            } else {
                this[key] = data[key];
            }
        }
    }
    render(damaged=false){
        if(this.hp < 0 && damaged === false){
            this.r = this.initialRadius * 1.5;
            if(this.renderRadius > this.r*0.99){
                return;
            }
            ctx.globalAlpha = 1-this.renderRadius/this.r;
        }

        this.renderRadius = interpolate(this.renderRadius, this.r, 0.1);

        ctx.lineWidth = 3;
        if(damaged){
            if(ctx.globalAlpha > 0.95){
                ctx.globalAlpha = 0;//0.6;
                ctx.fillStyle = '#32CD32';
                ctx.strokeStyle = '#228B22';
            } else {
                ctx.fillStyle = '#008000';
                ctx.strokeStyle = '#006400';
            }
            ctx.globalAlpha /= 1.5;
        } else {
            ctx.fillStyle = '#32CD32';
            ctx.strokeStyle = '#228B22';
        }

        ctx.translate(this.renderX, this.renderY);
        ctx.rotate(this.renderAngle-Math.PI/2);
        ctx.drawImage(peaImg, -this.renderRadius*1.3, -this.renderRadius*1.3, this.renderRadius*2.6, this.renderRadius*2.6);
        ctx.rotate(-this.renderAngle+Math.PI/2);
        ctx.translate(-this.renderX, -this.renderY);

        if(!damaged && Date.now() - this.lastDamageTime < petalDamageTime){
            ctx.globalAlpha = 1 - (Date.now() - this.lastDamageTime) / petalDamageTime;
            this.render(true);
            ctx.globalAlpha = 1;
        }

        ctx.globalAlpha = 1;
    }
}

class BasicPetal {
    constructor(init){
        this.rarity = init.rarity;

        this.type = 'basicpetal';
        this.angle = init.angle;

        this.x = init.x;
        this.y = init.y;

        this.r = init.r;
        this.initialRadius = init.r;

        this.renderX = init.x;
        this.renderY = init.y;

        this.impulse = {x: 0, y: 0};// unused

        this.hp = init.hp;

        this.damage = init.damage;
        this.lastDamageTime = 0;
        this.lastHealTime = Date.now();
        this.lastDeadTime = Date.now();

        this.renderRadius = 0;

        this.renderPetalDistance = 0;

        this.petalSlotType = 'basicpetalslot';

        this.rotationSpeed = init.rotationSpeed;

        this.desiredPetalDistance = 0;
    }
    simulate(parent, dt){
        this.angle += this.rotationSpeed*dt;
        if(this.angle > Math.PI*2){
            this.angle -= Math.PI*2;
        }

        // set our position to the flower's minus their velocity to give the illusion of being behind them
        const targetPosition = {
            x: parent.x + Math.cos(this.angle)*this.renderPetalDistance,
            y: parent.y + Math.sin(this.angle)*this.renderPetalDistance
        };

        this.x = targetPosition.x - Math.cos(parent.angle)*parent.magnitude*dt/120;
        this.y = targetPosition.y - Math.sin(parent.angle)*parent.magnitude*dt/120;

        this.desiredPetalDistance = this.renderPetalDistance + (parent.petalDistance - this.renderPetalDistance) - (parent.petalDistance - this.renderPetalDistance) * Math.pow(0.8, dt*12)//interpolate(this.renderPetalDistance, parent.petalDistance, 0.5);

        if(parent.type === 'evilflower'){
            if(parent.rarity === 'boss'){
                this.renderPetalDistance = interpolate(this.renderPetalDistance, this.desiredPetalDistance, 1/15);
            } else {
                this.renderPetalDistance = interpolate(this.renderPetalDistance, this.desiredPetalDistance, 1/10);
            }
            this.renderX = interpolate(this.renderX, this.x, .16);
            this.renderY = interpolate(this.renderY, this.y, .16);
        } else {
            this.renderPetalDistance = interpolate(this.renderPetalDistance, this.desiredPetalDistance, 0.6);
            this.renderX = interpolate(this.renderX, this.x, .22);
            this.renderY = interpolate(this.renderY, this.y, .22);
        }
    }
    updatePack(data){
        for(let key in data){
            if(key === 'hp' && data.hp !== this.hp){
                if(data.hp < this.hp){
                    this.lastDamageTime = Date.now();
                    if(data.hp < 0){
                        this.lastDeadTime = Date.now();
                    }
                } else {
                    this.lastHealTime = Date.now();
                    this.renderPetalDistance = 0;///= 3;// temp?
                    this.r = this.initialRadius;
                    this.renderRadius = this.r;
                }

                this.hp = data.hp;
            } else {
                this[key] = data[key];
            }
        }
    }
    render(damaged=false){
        if(this.hp < 0 && damaged === false){
            this.r = this.initialRadius * 1.5;
            if(this.renderRadius > this.r*0.99){
                return;
            }
            ctx.globalAlpha = 1-this.renderRadius/this.r;
        }

        this.renderRadius = interpolate(this.renderRadius, this.r, 0.1);

        ctx.lineWidth = 3;
        if(damaged){
            if(ctx.globalAlpha > 0.95){
                ctx.globalAlpha = 0;//0.6;
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
            } else {
                ctx.fillStyle = '#de1f1f';
                ctx.strokeStyle = '#b41919';
            }
            ctx.globalAlpha /= 1.5;
        } else {
            ctx.fillStyle = 'white';
            ctx.strokeStyle = '#cfcfcf';
        }

        ctx.beginPath();
        ctx.arc(this.renderX, this.renderY, this.renderRadius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // ctx.fillStyle = 'blue';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        // ctx.fill();
        // ctx.stroke();
        // ctx.closePath();

        if(!damaged && Date.now() - this.lastDamageTime < petalDamageTime){
            ctx.globalAlpha = 1 - (Date.now() - this.lastDamageTime) / petalDamageTime;
            this.render(true);
            ctx.globalAlpha = 1;
        }

        ctx.globalAlpha = 1;
    }
}

class RockPetal {
    constructor(init){
        this.rarity = init.rarity;

        this.type = 'rockpetal';
        this.angle = init.angle;

        this.x = init.x;
        this.y = init.y;

        this.r = init.r;
        this.initialRadius = init.r;

        this.renderX = init.x;
        this.renderY = init.y;

        this.impulse = {x: 0, y: 0};// unused

        this.hp = init.hp;

        this.damage = init.damage;
        this.lastDamageTime = 0;
        this.lastHealTime = Date.now();
        this.lastDeadTime = Date.now();

        this.renderRadius = 0;

        this.renderPetalDistance = 0;

        this.generateVerticies();

        this.petalSlotType = 'rockpetalslot';

        this.rotationSpeed = init.rotationSpeed;
    }
    simulate(parent, dt){
        this.angle += this.rotationSpeed*dt;
        if(this.angle > Math.PI*2){
            this.angle -= Math.PI*2;
        }

        // set our position to the flower's minus their velocity to give the illusion of being behind them
        const targetPosition = {
            x: parent.x + Math.cos(this.angle)*this.renderPetalDistance,
            y: parent.y + Math.sin(this.angle)*this.renderPetalDistance
        };

        this.x = targetPosition.x - Math.cos(parent.angle)*parent.magnitude*dt/120;
        this.y = targetPosition.y - Math.sin(parent.angle)*parent.magnitude*dt/120;

        this.desiredPetalDistance = this.renderPetalDistance + (parent.petalDistance - this.renderPetalDistance) - (parent.petalDistance - this.renderPetalDistance) * Math.pow(0.8, dt*12)//interpolate(this.renderPetalDistance, parent.petalDistance, 0.5);

        if(parent.type === 'evilflower'){
            if(parent.rarity === 'boss'){
                this.renderPetalDistance = interpolate(this.renderPetalDistance, this.desiredPetalDistance, 1/15);
            } else {
                this.renderPetalDistance = interpolate(this.renderPetalDistance, this.desiredPetalDistance, 1/10);
            }
            this.renderX = interpolate(this.renderX, this.x, .16);
            this.renderY = interpolate(this.renderY, this.y, .16);
        } else {
            this.renderPetalDistance = interpolate(this.renderPetalDistance, this.desiredPetalDistance, 0.6);
            this.renderX = interpolate(this.renderX, this.x, .22);
            this.renderY = interpolate(this.renderY, this.y, .22);
        }
    }
    updatePack(data){
        for(let key in data){
            if(key === 'hp' && data.hp !== this.hp){
                if(data.hp < this.hp){
                    this.lastDamageTime = Date.now();
                    if(data.hp < 0){
                        this.lastDeadTime = Date.now();
                    }
                } else {
                    this.lastHealTime = Date.now();
                    this.renderPetalDistance = 0;///= 3;// temp?
                    this.r = this.initialRadius;
                    this.renderRadius = this.r;
                }

                this.hp = data.hp;
            } else {
                this[key] = data[key];
            }
        }
    }
    render(damaged=false){
        if(this.hp < 0 && damaged === false){
            this.r = this.initialRadius * 1.5;
            if(this.renderRadius > this.r*0.99){
                return;
            }
            ctx.globalAlpha = 1-this.renderRadius/this.r;
        }

        this.renderRadius = interpolate(this.renderRadius, this.r, 0.1);

        ctx.lineWidth = 3;
        if(damaged){
            if(ctx.globalAlpha > 0.95){
                ctx.globalAlpha = 0.6
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
            } else {
                ctx.fillStyle = '#de1f1f';
                ctx.strokeStyle = '#b41919';
            }
            ctx.globalAlpha /= 1.5;
        } else {
            ctx.fillStyle = '#777777';
            ctx.strokeStyle = '#606060';
        }

        ctx.lineWidth = 5;

        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(this.getVertexX(0), this.getVertexY(0));
        for(let i = 0; i < this.verticies.length; i++){
            ctx.lineTo(this.getVertexX(i), this.getVertexY(i));
        }
        ctx.lineTo(this.getVertexX(0), this.getVertexY(0));
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.lineCap = 'butt';

        // ctx.fillStyle = 'blue';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        // ctx.fill();
        // ctx.stroke();
        // ctx.closePath();

        if(!damaged && Date.now() - this.lastDamageTime < petalDamageTime){
            ctx.globalAlpha = 1 - (Date.now() - this.lastDamageTime) / petalDamageTime;
            this.render(true);
            ctx.globalAlpha = 1;
        }

        ctx.globalAlpha = 1;
    }
    generateVerticies(){
        this.verticies = [];

        // i is the angle in radians
        for(let i = 0; i < Math.PI*2; i+= Math.PI*2/5){
            // generate a point randomly offset
            this.verticies.push({
                x: Math.cos(i),
                y: Math.sin(i),
            })
        }
    }
    getVertexX(i){
        return this.renderX+this.verticies[i].x*this.renderRadius;
    }
    getVertexY(i){
        return this.renderY+this.verticies[i].y*this.renderRadius;
    }
}

class DiepPetal {
    constructor(init){
        this.rarity = init.rarity;

        this.type = 'dieppetal';
        this.angle = init.angle;

        this.x = init.x;
        this.y = init.y;

        this.r = init.r;
        this.initialRadius = init.r;

        this.renderX = init.x;
        this.renderY = init.y;

        this.impulse = {x: 0, y: 0};// unused

        this.hp = init.hp;

        this.damage = init.damage;
        this.lastDamageTime = 0;
        this.lastHealTime = Date.now();
        this.lastDeadTime = Date.now();

        this.renderRadius = 0;

        this.renderPetalDistance = 0;

        this.petalSlotType = 'dieppetalslot';

        this.bullets = init.bullets;

        this.bulletSpeed = init.bulletSpeed;

        this.shootAngle = init.shootAngle;
        this.renderShootAngle = init.shootAngle;

        this.bulletRadius = init.bulletRadius;

        this.rotationSpeed = init.rotationSpeed;
    }
    simulate(parent, dt){
        // simulating bullets (this is not checked server side so this is just a prediction)
        // we have to do it this way or else we have to send state every frame...
        for(let i in this.bullets){
            this.bullets[i].x += Math.cos(this.bullets[i].angle) * this.bulletSpeed * dt;
            this.bullets[i].y += Math.sin(this.bullets[i].angle) * this.bulletSpeed * dt;
        }

        this.angle += this.rotationSpeed*dt;
        if(this.angle > Math.PI*2){
            this.angle -= Math.PI*2;
        }

        // set our position to the flower's minus their velocity to give the illusion of being behind them
        const targetPosition = {
            x: parent.x + Math.cos(this.angle)*this.renderPetalDistance,
            y: parent.y + Math.sin(this.angle)*this.renderPetalDistance
        };

        this.x = targetPosition.x - Math.cos(parent.angle)*parent.magnitude*dt/120;
        this.y = targetPosition.y - Math.sin(parent.angle)*parent.magnitude*dt/120;

        this.desiredPetalDistance = this.renderPetalDistance + (parent.petalDistance - this.renderPetalDistance) - (parent.petalDistance - this.renderPetalDistance) * Math.pow(0.8, dt*12)//interpolate(this.renderPetalDistance, parent.petalDistance, 0.5);

        if(parent.type === 'evilflower'){
            if(parent.rarity === 'boss'){
                this.renderPetalDistance = interpolate(this.renderPetalDistance, this.desiredPetalDistance, 1/15);
            } else {
                this.renderPetalDistance = interpolate(this.renderPetalDistance, this.desiredPetalDistance, 1/10);
            }
            this.renderX = interpolate(this.renderX, this.x, .16);
            this.renderY = interpolate(this.renderY, this.y, .16);
        } else {
            this.renderPetalDistance = interpolate(this.renderPetalDistance, this.desiredPetalDistance, 0.6);
            this.renderX = interpolate(this.renderX, this.x, .22);
            this.renderY = interpolate(this.renderY, this.y, .22);
        }
    }
    updatePack(data){
        for(let key in data){
            if(key === 'hp' && data.hp !== this.hp){
                if(data.hp < this.hp){
                    this.lastDamageTime = Date.now();
                    if(data.hp < 0){
                        this.lastDeadTime = Date.now();
                    }
                } else {
                    this.lastHealTime = Date.now();
                    this.renderPetalDistance = 0;///= 3;// temp?
                    this.r = this.initialRadius;
                    this.renderRadius = this.r;
                }

                this.hp = data.hp;
            } else if(key === 'bulletsToRemove'){
                for(let i = 0; i < data.bulletsToRemove.length; i++){
                    // delete this.bullets[data.bulletsToRemove[i]];
                    this.bullets[data.bulletsToRemove[i]].dead = true;
                    this.bullets[data.bulletsToRemove[i]].deadTime = 100;// fade out for 100ms
                }
            } else if(key === 'bulletsToAdd'){
                for(let i = 0; i < data.bulletsToAdd.length; i++){
                    this.bullets[data.bulletsToAdd[i].id] = data.bulletsToAdd[i];
                }
            } else {
                this[key] = data[key];
            }
        }
    }
    render(damaged=false){
        if (damaged === false){
            ctx.fillStyle = '#00b0df';
            ctx.strokeStyle = '#0085a9';
            ctx.lineWidth = 3;
            for(let i in this.bullets){
                if(this.bullets[i].renderX === undefined){
                    this.bullets[i].renderX = this.bullets[i].x;
                    this.bullets[i].renderY = this.bullets[i].y;
                    this.bullets[i].renderRadius = 0;
                }
                if(this.bullets[i].dead === true){
                    this.bullets[i].deadTime -= renderDt;
                    ctx.globalAlpha = this.bullets[i].deadTime / 100;
                    if(this.bullets[i].deadTime < 0){
                        delete this.bullets[i];
                        continue;
                    }
                }
                this.bullets[i].renderX = interpolate(this.bullets[i].renderX, this.bullets[i].x, 0.1);
                this.bullets[i].renderY = interpolate(this.bullets[i].renderY, this.bullets[i].y, 0.1);
                this.bullets[i].renderRadius = interpolate(this.bullets[i].renderRadius, this.bulletRadius, 0.1);
                ctx.beginPath();
                ctx.arc(this.bullets[i].renderX, this.bullets[i].renderY, this.bullets[i].renderRadius, 0, Math.PI*2);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();

                ctx.globalAlpha = 1;
            }
        }


        if(this.hp < 0 && damaged === false){
            this.r = this.initialRadius * 1.5;
            if(this.renderRadius > this.r*0.99){
                return;
            }
            ctx.globalAlpha = 1-this.renderRadius/this.r;
        }

        this.renderRadius = interpolate(this.renderRadius, this.r, 0.1);

        this.renderShootAngle = interpolateLinearDirection(this.renderShootAngle, this.shootAngle, 0.06);

        ctx.lineWidth = 3;
        if(damaged){
            if(ctx.globalAlpha > 0.95){
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
            } else {
                ctx.fillStyle = '#de1f1f';
                ctx.strokeStyle = '#b41919';
            }
            ctx.globalAlpha /= 1.5;
        } else {
            ctx.fillStyle = '#989898';
            ctx.strokeStyle = '#737373';
        }

        ctx.translate(this.renderX, this.renderY);
        ctx.rotate(this.renderShootAngle-Math.PI/2);

        // gun
        if(damaged === false){
            ctx.beginPath();
            ctx.roundRect(-this.renderRadius/2.2, 0, this.renderRadius/1.1, this.renderRadius*1.8, 1);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }

        // body
        ctx.fillStyle = '#00b0df';
        ctx.strokeStyle = '#0085a9';

        ctx.beginPath();
        ctx.arc(0, 0, this.renderRadius, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.rotate(-this.renderShootAngle+Math.PI/2);
        ctx.translate(-this.renderX, -this.renderY);


        // ctx.fillStyle = 'blue';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        // ctx.fill();
        // ctx.stroke();
        // ctx.closePath();

        if(!damaged && Date.now() - this.lastDamageTime < petalDamageTime){
            ctx.globalAlpha = 1 - (Date.now() - this.lastDamageTime) / petalDamageTime;
            this.render(true);
            ctx.globalAlpha = 1;
        }

        ctx.globalAlpha = 1;
    }
}

class BubblePetal {
    constructor(init){
        this.rarity = init.rarity;

        this.type = 'bubblepetal';
        this.angle = init.angle;

        this.x = init.x;
        this.y = init.y;

        this.r = init.r;
        this.initialRadius = init.r;

        this.renderX = init.x;
        this.renderY = init.y;

        this.impulse = {x: 0, y: 0};// unused

        this.hp = init.hp;

        this.damage = init.damage;
        this.lastDamageTime = 0;
        this.lastHealTime = Date.now();
        this.lastDeadTime = Date.now();

        this.renderRadius = 0;

        this.renderPetalDistance = 0;

        this.petalSlotType = 'bubblepetalslot';

        this.rotationSpeed = init.rotationSpeed;
    }
    simulate(parent, dt){
        this.angle += this.rotationSpeed*dt;
        if(this.angle > Math.PI*2){
            this.angle -= Math.PI*2;
        }

        // set our position to the flower's minus their velocity to give the illusion of being behind them
        const targetPosition = {
            x: parent.x + Math.cos(this.angle)*Math.min(61.1,this.renderPetalDistance),
            y: parent.y + Math.sin(this.angle)*Math.min(61.1,this.renderPetalDistance)
        };

        this.x = targetPosition.x - Math.cos(parent.angle)*parent.magnitude*dt/120;
        this.y = targetPosition.y - Math.sin(parent.angle)*parent.magnitude*dt/120;

        this.desiredPetalDistance = this.renderPetalDistance + (parent.petalDistance - this.renderPetalDistance) - (parent.petalDistance - this.renderPetalDistance) * Math.pow(0.8, dt*12)//interpolate(this.renderPetalDistance, parent.petalDistance, 0.5);

        this.renderPetalDistance = interpolate(this.renderPetalDistance, this.desiredPetalDistance, 0.6);

        this.renderX = interpolate(this.renderX, this.x, .22);
        this.renderY = interpolate(this.renderY, this.y, .22);
    }
    updatePack(data){
        for(let key in data){
            if(key === 'hp' && data.hp !== this.hp){
                if(data.hp < this.hp){
                    this.lastDamageTime = Date.now();
                    if(data.hp < 0){
                        this.lastDeadTime = Date.now();
                    }
                } else {
                    this.lastHealTime = Date.now();
                    this.renderPetalDistance = 0;///= 3;// temp?
                    this.r = this.initialRadius;
                    this.renderRadius = this.r;
                }

                this.hp = data.hp;
            } else {
                this[key] = data[key];
            }
        }
    }
    render(damaged=false){
        if(this.hp < 0 && damaged === false){
            this.r = this.initialRadius * 1.5;
            if(this.renderRadius > this.r*0.99){
                return;
            }
            ctx.globalAlpha = 1-this.renderRadius/this.r;
        }

        this.renderRadius = interpolate(this.renderRadius, this.r, 0.1);

        ctx.lineWidth = 2;
        if(damaged){
            if(ctx.globalAlpha > 0.95){
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
            } else {
                ctx.fillStyle = '#de1f1f';
                ctx.strokeStyle = '#b41919';
            }
            ctx.globalAlpha /= 1.5;
        } else {
            ctx.fillStyle = '#eeeeee';
            ctx.strokeStyle = '#f0f0f0';
        }

        ctx.beginPath();
        ctx.arc(this.renderX, this.renderY, this.renderRadius, 0, Math.PI*2);
        if(ctx.globalAlpha === 1)ctx.globalAlpha = 0.306942;
        ctx.fill();
        if(ctx.globalAlpha === 0.306942)ctx.globalAlpha = 0.8069;
        ctx.stroke();
        ctx.closePath();

        if(this.hp > 0){
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            // shift up 1/2 of the bubble to the top and right
            ctx.arc(this.renderX+this.renderRadius/4*1.2, this.renderY-this.renderRadius/4*1.2, 2, 0, Math.PI*2);
            ctx.globalAlpha = 0.4;
            ctx.fill();
            ctx.closePath();
        }

        ctx.globalAlpha = 1;

        // ctx.fillStyle = 'blue';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        // ctx.fill();
        // ctx.stroke();
        // ctx.closePath();

        if(!damaged && Date.now() - this.lastDamageTime < petalDamageTime){
            ctx.globalAlpha = 1 - (Date.now() - this.lastDamageTime) / petalDamageTime;
            this.render(true);
            ctx.globalAlpha = 1;
        }

        ctx.globalAlpha = 1;
    }
}